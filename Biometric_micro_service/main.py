from fastapi import FastAPI, UploadFile, File, Form

import face_recognition
import numpy as np
import os
import json

app = FastAPI()

EMBEDDING_FOLDER = "embeddings"
THRESHOLD = 0.6  # Lower = stricter matching


# Utility: Extract embedding from image
def extract_embedding(image_bytes):
    image = face_recognition.load_image_file(image_bytes)
    encodings = face_recognition.face_encodings(image)

    if len(encodings) == 0:
        return None

    return encodings[0]

#Enroll User
@app.post("/enroll")
async def enroll(user_id: str = Form(...), file: UploadFile = File(...)):

    embedding = extract_embedding(file.file)

    if embedding is None:
        return {"status": "error", "message": "No face detected"}


    return {"status": "success", "message": "User enrolled successfully","embedding": embedding.tolist()}


# =========================
# 2️⃣ VERIFY USER
# =========================
@app.post("/verify")
async def verify(user_id: str = Form(...), file: UploadFile = File(...),stored_embedding: str = Form(...)):

    
    live_embedding = extract_embedding(file.file)

    if live_embedding is None:
        return {"status": "error", "message": "No face detected"}
    stored_embedding = np.array(json.loads(stored_embedding))


    # Compare
    distance = np.linalg.norm(stored_embedding - live_embedding)

    if distance < THRESHOLD:
        return {
            "status": "success",
            "distance": float(distance)
        }
    else:
        return {
            "status": "no_match",
            "distance": float(distance)
        }