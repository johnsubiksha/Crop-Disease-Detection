import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
import json
import os

from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

# ==========================================
# Load Trained Model
# ==========================================

model = tf.keras.models.load_model(

    "models/mobilenet_finetuned_crop_model.h5"
)

# ==========================================
# Load Class Names
# ==========================================

with open("models/class_names.json", "r") as f:

    class_names = json.load(f)

# ==========================================
# Show Classes
# ==========================================

print("\n========== CLASSES ==========\n")

for i, name in enumerate(class_names):

    print(f"{i} --> {name}")

# ==========================================
# Input Image Path
# ==========================================

img_path = input("\nEnter image path: ")

# ==========================================
# Check Image Exists
# ==========================================

if not os.path.exists(img_path):

    print("\nImage path not found!")

    exit()

# ==========================================
# Load Image
# ==========================================

img = image.load_img(

    img_path,

    target_size=(128,128)
)

# ==========================================
# Convert To Array
# ==========================================

img_array = image.img_to_array(img)

# ==========================================
# Add Batch Dimension
# ==========================================

img_array = np.expand_dims(

    img_array,

    axis=0
)

# ==========================================
# MobileNet Preprocessing
# ==========================================

img_array = preprocess_input(img_array)

# ==========================================
# Predict
# ==========================================

prediction = model.predict(img_array)

# ==========================================
# Predicted Class
# ==========================================

predicted_index = np.argmax(prediction)

predicted_class = class_names[predicted_index]

confidence = np.max(prediction) * 100

# ==========================================
# Confidence Threshold
# ==========================================

THRESHOLD = 60

# ==========================================
# Show All Probabilities
# ==========================================

print("\n========== ALL PROBABILITIES ==========\n")

for i in range(len(class_names)):

    prob = prediction[0][i] * 100

    print(f"{class_names[i]} : {prob:.2f}%")

# ==========================================
# Final Output
# ==========================================

print("\n========== FINAL RESULT ==========\n")

if confidence < THRESHOLD:

    print("Model is not confident enough.")

    print(f"Highest Confidence : {confidence:.2f}%")

else:

    print("Prediction :", predicted_class)

    print(f"Confidence : {confidence:.2f}%")

# ==========================================
# Display Image
# ==========================================

plt.imshow(img)

if confidence < THRESHOLD:

    plt.title(

        f"Low Confidence\n{confidence:.2f}%"
    )

else:

    plt.title(

        f"{predicted_class}\nConfidence: {confidence:.2f}%"
    )

plt.axis("off")

plt.show()