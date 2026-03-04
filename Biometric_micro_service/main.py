from fastapi import FastAPI, UploadFile, File, Form
import face_recognition
import numpy as np
import json
import cv2

app = FastAPI()

THRESHOLD = 0.5  # Matching strictness


# =========================
# Face Embedding Extraction
# =========================
def extract_embedding(upload_file: UploadFile):

    upload_file.file.seek(0)

    image = face_recognition.load_image_file(upload_file.file)

    # Resize image for faster processing
    image = cv2.resize(image, (0, 0), fx=0.5, fy=0.5)

    face_locations = face_recognition.face_locations(image)

    # No face
    if len(face_locations) == 0:
        return "NO_FACE"

    # Multiple faces
    if len(face_locations) > 1:
        return "MULTIPLE_FACES"

    top, right, bottom, left = face_locations[0]

    face_width = right - left
    face_height = bottom - top

    # Face too small
    if face_width < 120 or face_height < 120:
        return "FACE_TOO_SMALL"

    img_height, img_width, _ = image.shape

    # Face not centered
    if left < 50 or right > img_width - 50:
        return "FACE_NOT_CENTERED"

    if top < 50 or bottom > img_height - 50:
        return "FACE_NOT_CENTERED"

    # Face coverage check
    face_area = (bottom - top) * (right - left)
    image_area = img_height * img_width

    coverage = face_area / image_area

    if coverage < 0.08:
        return "FACE_TOO_FAR"

    # Generate embeddings
    encodings = face_recognition.face_encodings(image, face_locations)

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
    user_id: str = Form(...),
    file: UploadFile = File(...)
):

    embedding = extract_embedding(file)

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
    user_id: str = Form(...),
    file: UploadFile = File(...),
    stored_embedding: str = Form(...)
):

    live_embedding = extract_embedding(file)

    if isinstance(live_embedding, str):
        return handle_embedding_error(live_embedding)

    stored_embedding = np.array(json.loads(stored_embedding))

    distance = np.linalg.norm(stored_embedding - live_embedding)

    if distance < THRESHOLD:
        return {
            "status": "success",
            "match": True,
            "distance": float(distance)
        }

    return {
        "status": "no_match",
        "match": False,
        "message": "Face cannot be recognized",
        "distance": float(distance)
    }