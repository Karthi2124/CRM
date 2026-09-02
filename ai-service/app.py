from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
import os
import uuid

app = FastAPI()

# Load YOLO model
model = YOLO("yolo11n.pt")


@app.get("/")
def home():
    return {
        "message": "YOLO AI Service is running"
    }


@app.post("/detect")
async def detect(file: UploadFile = File(...)):

    # Create a temporary file name
    filename = f"temp_{uuid.uuid4()}_{file.filename}"

    # Save uploaded image
    with open(filename, "wb") as buffer:
        buffer.write(await file.read())

    # Run YOLO detection
    results = model(filename)

    detections = []

    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])

            detections.append({
                "object": model.names[class_id],
                "confidence": round(confidence * 100, 2)
            })

    # Remove temporary file
    if os.path.exists(filename):
        os.remove(filename)

    return {
        "success": True,
        "detections": detections
    }