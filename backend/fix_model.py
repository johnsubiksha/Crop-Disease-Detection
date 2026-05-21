import tensorflow as tf

# Load old model
model = tf.keras.models.load_model(
    "models/mobilenet_finetuned_crop_model.h5",
    compile=False
)

# Save in new format
model.save(
    "models/fixed_model.keras"
)

print("Model fixed and saved!")