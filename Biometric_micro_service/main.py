from fastapi import FastAPI, UploadFile, File, Form
import face_recognition
import numpy as np
import json
import cv2
import io

app = FastAPI()

THRESHOLD = 0.5  # Matching strictness


# =========================
# Face Embedding Extraction
# =========================
async def extract_embedding(upload_file: UploadFile):
    
    print("Received file: ", upload_file.filename, upload_file.content_type)
    contents = await upload_file.read()
    print("Bytes Length: ", len(contents))
    image = face_recognition.load_image_file(io.BytesIO(contents))

    # Optional: you can re‑enable this later if performance is an issue
    # For now keep full resolution so detection is easier on all phones.
    # image = cv2.resize(image, (0, 0), fx=0.5, fy=0.5)

    # Ensure RGB format
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    face_locations = face_recognition.face_locations(image, model="hog")

    print("face_locations:", face_locations)

    if len(face_locations) == 0:
        return "NO_FACE"

    if len(face_locations) > 1:
        return "MULTIPLE_FACES"

    top, right, bottom, left = face_locations[0]

    face_width = right - left
    face_height = bottom - top

    img_height, img_width, _ = image.shape
    face_area = (bottom - top) * (right - left)
    image_area = img_height * img_width
    coverage = face_area / image_area

    print("face_width, face_height:", face_width, face_height)
    print("img_width, img_height:", img_width, img_height)
    print("coverage:", coverage)
    print("face box:", top, right, bottom, left)

    # Relaxed constraints compared to your original
    if face_width < 40 or face_height < 40:
        return "FACE_TOO_SMALL"

    margin = 30  # was 50
    if left < margin or right > img_width - margin:
        return "FACE_NOT_CENTERED"

    if top < margin or bottom > img_height - margin:
        return "FACE_NOT_CENTERED"

    if coverage < 0.04:  # was 0.08
        return "FACE_TOO_FAR"

    encodings = face_recognition.face_encodings(
        image,
        known_face_locations=face_locations
    )

    if len(encodings) == 0:
        return "ENCODING_FAILED"

    return encodings[0]


# =========================
# Error Handler
# =========================
def handle_embedding_error(result):
    if result == "NO_FACE":
        return {"status": "error", "message": "No face detected"}

    if result == "MULTIPLE_FACES":
        return {"status": "error", "message": "Multiple faces detected"}

    if result == "FACE_TOO_SMALL":
        return {"status": "error", "message": "Move closer to the camera"}

    if result == "FACE_TOO_FAR":
        return {"status": "error", "message": "Move closer to the camera"}

    if result == "FACE_NOT_CENTERED":
        return {"status": "error", "message": "Center your face in the frame"}

    if result == "ENCODING_FAILED":
        return {"status": "error", "message": "Face encoding failed"}

    return None


# =========================
# ENROLL USER
# =========================
@app.post("/enroll")
async def enroll(
    file: UploadFile = File(...)
):
    embedding = await extract_embedding(file)

    if isinstance(embedding, str):
        return handle_embedding_error(embedding)

    return {
        "status": "success",
        "message": "User enrolled successfully",
        "embedding": embedding.tolist()
    }


# =========================
# VERIFY USER
# =========================
@app.post("/verify")
async def verify(
    file: UploadFile = File(...),
    stored_embedding: str = Form(...)
):
    print("hit verify")

    live_embedding = await extract_embedding(file)
    print("live_embedding:", live_embedding)

    if isinstance(live_embedding, str):
        return handle_embedding_error(live_embedding)

    stored_embedding = np.array(json.loads(stored_embedding))

    distance = face_recognition.face_distance([stored_embedding], live_embedding)

    # face_distance returns an array
    distance_value = float(distance[0]) if hasattr(distance, "__len__") else float(distance)

    if distance_value < THRESHOLD:
        return {
            "status": "success",
            "match": True,
            "distance": distance_value
        }

    return {
        "status": "no_match",
        "match": False,
        "message": "Face cannot be recognized",
        "distance": distance_value
    }