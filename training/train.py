import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os
import json

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import (
    EarlyStopping,
    ModelCheckpoint
)

from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

from sklearn.metrics import (
    confusion_matrix,
    classification_report
)

# ==========================================
# Dataset Paths
# ==========================================

train_path = "small_dataset/Train"
val_path = "small_dataset/Val"
test_path = "small_dataset/Test"

# ==========================================
# Image Settings
# ==========================================

IMG_SIZE = 128
BATCH_SIZE = 32

# ==========================================
# Data Generators
# ==========================================

train_datagen = ImageDataGenerator(

    preprocessing_function=preprocess_input,

    rotation_range=15,

    zoom_range=0.1,

    horizontal_flip=True
)

val_test_datagen = ImageDataGenerator(

    preprocessing_function=preprocess_input
)

# ==========================================
# Load Train Data
# ==========================================

train_data = train_datagen.flow_from_directory(

    train_path,

    target_size=(IMG_SIZE, IMG_SIZE),

    batch_size=BATCH_SIZE,

    class_mode='categorical'
)

# ==========================================
# Load Validation Data
# ==========================================

val_data = val_test_datagen.flow_from_directory(

    val_path,

    target_size=(IMG_SIZE, IMG_SIZE),

    batch_size=BATCH_SIZE,

    class_mode='categorical'
)

# ==========================================
# Load Test Data
# ==========================================

test_data = val_test_datagen.flow_from_directory(

    test_path,

    target_size=(IMG_SIZE, IMG_SIZE),

    batch_size=BATCH_SIZE,

    class_mode='categorical',

    shuffle=False
)

# ==========================================
# Save Class Labels
# ==========================================

class_names = list(train_data.class_indices.keys())

os.makedirs("models", exist_ok=True)

with open("models/class_names.json", "w") as f:

    json.dump(class_names, f)

print("\nClass labels saved!")

# ==========================================
# Number of Classes
# ==========================================

num_classes = len(class_names)

print("\nClasses:\n")

print(class_names)

# ==========================================
# Load MobileNetV2
# ==========================================

base_model = MobileNetV2(

    weights='imagenet',

    include_top=False,

    input_shape=(128,128,3)
)

# ==========================================
# Freeze Base Model
# ==========================================

base_model.trainable = False

# ==========================================
# Build Model
# ==========================================

model = Sequential([

    base_model,

    GlobalAveragePooling2D(),

    Dense(128, activation='relu'),

    Dropout(0.3),

    Dense(num_classes, activation='softmax')
])

# ==========================================
# Compile Model
# ==========================================

model.compile(

    optimizer='adam',

    loss='categorical_crossentropy',

    metrics=['accuracy']
)

# ==========================================
# Callbacks
# ==========================================

early_stop = EarlyStopping(

    monitor='val_loss',

    patience=2,

    restore_best_weights=True
)

checkpoint = ModelCheckpoint(

    "models/best_model.h5",

    monitor='val_accuracy',

    save_best_only=True
)

# ==========================================
# FEATURE EXTRACTION TRAINING
# ==========================================

print("\n========== FEATURE EXTRACTION ==========\n")

history = model.fit(

    train_data,

    validation_data=val_data,

    epochs=3,

    callbacks=[early_stop, checkpoint]
)

# ==========================================
# Fine Tuning
# ==========================================

print("\n========== FINE TUNING ==========\n")

base_model.trainable = True

# Freeze first layers
for layer in base_model.layers[:-30]:

    layer.trainable = False

# Recompile
model.compile(

    optimizer=tf.keras.optimizers.Adam(1e-5),

    loss='categorical_crossentropy',

    metrics=['accuracy']
)

# ==========================================
# Fine Tune Training
# ==========================================

history_fine = model.fit(

    train_data,

    validation_data=val_data,

    epochs=5,

    callbacks=[early_stop, checkpoint]
)

# ==========================================
# Save Final Model
# ==========================================

model.save(

    "models/mobilenet_finetuned_crop_model.h5"
)

print("\nFinal model saved!")

# ==========================================
# Evaluate Model
# ==========================================

test_loss, test_acc = model.evaluate(test_data)

print(f"\nTest Accuracy: {test_acc * 100:.2f}%")

# ==========================================
# Predictions
# ==========================================

predictions = model.predict(test_data)

predicted_classes = np.argmax(predictions, axis=1)

true_classes = test_data.classes

# ==========================================
# Classification Report
# ==========================================

print("\n========== CLASSIFICATION REPORT ==========\n")

report = classification_report(

    true_classes,

    predicted_classes,

    target_names=class_names
)

print(report)

# ==========================================
# Confusion Matrix
# ==========================================

cm = confusion_matrix(

    true_classes,

    predicted_classes
)

plt.figure(figsize=(12,10))

sns.heatmap(

    cm,

    annot=False,

    cmap='Blues'
)

plt.title("Confusion Matrix")

plt.xlabel("Predicted Label")

plt.ylabel("True Label")

plt.show()

# ==========================================
# Accuracy Graph
# ==========================================

train_acc = (

    history.history['accuracy'] +

    history_fine.history['accuracy']
)

val_acc = (

    history.history['val_accuracy'] +

    history_fine.history['val_accuracy']
)

plt.figure(figsize=(8,5))

plt.plot(train_acc, label='Train Accuracy')

plt.plot(val_acc, label='Validation Accuracy')

plt.xlabel("Epoch")

plt.ylabel("Accuracy")

plt.title("Training + Fine Tuning Accuracy")

plt.legend()

plt.show()