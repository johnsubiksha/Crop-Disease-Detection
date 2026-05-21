from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
import json
import logging

from PIL import Image
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

# ==========================================
# Logging
# ==========================================

logging.basicConfig(level=logging.INFO)

# ==========================================
# Load Model
# ==========================================

model = tf.keras.models.load_model(
    "models/fixed_model.keras"
)

# ==========================================
# Load Class Names
# ==========================================

with open("models/class_names.json", "r") as f:
    class_names = json.load(f)

# ==========================================
# FastAPI App
# ==========================================

app = FastAPI(
    title="Crop Disease Detection API"
)

# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# Health Check
# ==========================================

@app.get("/")
def health_check():

    return {
        "status": "API Running"
    }

# ==========================================
# Prediction Endpoint
# ==========================================

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    try:

        print("\n========== REQUEST RECEIVED ==========\n")

        print("Filename :", file.filename)

        img = Image.open(file.file)

        print("Image opened successfully")

        img = img.resize((128,128))

        img_array = image.img_to_array(img)

        img_array = np.expand_dims(

            img_array,

            axis=0
        )

        img_array = preprocess_input(img_array)

        print("Preprocessing done")

        prediction = model.predict(img_array)

        print("Prediction done")

        predicted_index = np.argmax(prediction)

        predicted_class = class_names[predicted_index]

        confidence = float(

            np.max(prediction) * 100
        )

        probabilities = {}

        for i in range(len(class_names)):

            probabilities[class_names[i]] = round(

                float(prediction[0][i] * 100),

                2
            )

        return {

            "prediction": predicted_class,

            "confidence": round(confidence, 2),

            "probabilities": probabilities
        }

    except Exception as e:

        print("\n========== ERROR ==========\n")

        print(str(e))

        return {

            "error": str(e)
        }
