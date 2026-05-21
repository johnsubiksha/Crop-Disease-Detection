from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

import tensorflow as tf
import numpy as np
import json
import logging

from PIL import Image

from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.applications import MobileNetV2

from tensorflow.keras.layers import Dense
from tensorflow.keras.layers import Dropout
from tensorflow.keras.layers import GlobalAveragePooling2D

from tensorflow.keras.models import Sequential

# ==========================================
# Logging
# ==========================================

logging.basicConfig(level=logging.INFO)

# ==========================================
# Number of Classes
# ==========================================

NUM_CLASSES = 29

# ==========================================
# Base Model
# ==========================================

base_model = MobileNetV2(

    weights='imagenet',

    include_top=False,

    input_shape=(128,128,3)
)

base_model.trainable = False

# ==========================================
# Final Model
# ==========================================

model = Sequential([

    base_model,

    GlobalAveragePooling2D(),

    Dense(128, activation='relu'),

    Dropout(0.3),

    Dense(NUM_CLASSES, activation='softmax')
])

# ==========================================
# Load Saved Weights
# ==========================================

model.load_weights(

    "models/model.weights.h5"
)

print("\nModel Loaded Successfully!\n")

# ==========================================
# Load Class Names
# ==========================================

with open(

    "models/class_names.json",

    "r"

) as f:

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

        # ==================================
        # Open Image
        # ==================================

        img = Image.open(file.file)

        print("Image opened successfully")

        # ==================================
        # Resize
        # ==================================

        img = img.resize((128,128))

        # ==================================
        # Convert to Array
        # ==================================

        img_array = image.img_to_array(img)

        # ==================================
        # Add Batch Dimension
        # ==================================

        img_array = np.expand_dims(

            img_array,

            axis=0
        )

        # ==================================
        # Preprocess
        # ==================================

        img_array = preprocess_input(

            img_array
        )

        print("Preprocessing done")

        # ==================================
        # Prediction
        # ==================================

        prediction = model.predict(

            img_array
        )

        print("Prediction done")

        # ==================================
        # Prediction Result
        # ==================================

        predicted_index = np.argmax(

            prediction
        )

        predicted_class = class_names[
            predicted_index
        ]

        confidence = float(

            np.max(prediction) * 100
        )

        # ==================================
        # All Probabilities
        # ==================================

        probabilities = {}

        for i in range(len(class_names)):

            probabilities[class_names[i]] = round(

                float(prediction[0][i] * 100),

                2
            )

        # ==================================
        # Return Response
        # ==================================

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