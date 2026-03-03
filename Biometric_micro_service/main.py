from fastapi import FastAPI, UploadFile, File, Form

import face_recognition
import numpy as np
import os
import json

app = FastAPI()

EMBEDDING_FOLDER = "embeddings"
THRESHOLD = 0.6  # Lower = stricter matching

# Ensure embedding folder exists
if not os.path.exists(EMBEDDING_FOLDER):
    os.makedirs(EMBEDDING_FOLDER)

# Utility: Extract embedding from image
def extract_embedding(upload_file: UploadFile):
    upload_file.file.seek(0)  
    image = face_recognition.load_image_file(upload_file.file)
    encodings = face_recognition.face_encodings(image)

    return encodings[0] if encodings else None

# =========================
# 1️⃣ ENROLL USER
# =========================
@app.post("/enroll")
async def enroll(user_id: str = Form(...), file: UploadFile = File(...)):

    embedding = extract_embedding(file)

    if embedding is None:
        return {"status": "error", "message": "No face detected"}


    return {"status": "success", "message": "User enrolled successfully","embedding": embedding.tolist()}


# =========================
# 2️⃣ VERIFY USER
# =========================
@app.post("/verify")
async def verify(user_id: str = Form(...), file: UploadFile = File(...),stored_embedding: str = Form(...)):

    
    live_embedding = extract_embedding(file)

    if live_embedding is None:
        return {"status": "error", "message": "No face detected"}
    
    # Convert stored embedding string back to numpy array
    stored_embedding = np.array(json.loads(stored_embedding))
    
    # Compare
    distance = np.linalg.norm(stored_embedding - live_embedding)

    if distance < THRESHOLD:
        return {
            "status": "success",
            "match": True,
            "distance": float(distance)
        }
    else:
        return {
            "status": "no_match",
            "match": False,
            "distance": float(distance)
        }