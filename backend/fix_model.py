import tensorflow as tf

old_model = tf.keras.models.load_model(
    "models/mobilenet_finetuned_crop_model.h5",
    compile=False
)

old_model.save_weights(
    "models/model.weights.h5"
)

print("Weights saved!")