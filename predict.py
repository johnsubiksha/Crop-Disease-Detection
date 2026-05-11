import tensorflow as tf
import numpy as np
import cv2

# Load trained model
model = tf.keras.models.load_model('models/crop_resnet50_model.h5')

# Class labels
class_names = ['Early_Blight', 'Healthy', 'Late_Blight']

# Load image
image_path = 'test_images/test.jpg'

image = cv2.imread(image_path)

image = cv2.resize(image, (224, 224))

image = image / 255.0

image = np.expand_dims(image, axis=0)

# Prediction
prediction = model.predict(image)

class_index = np.argmax(prediction)

confidence = prediction[0][class_index]

predicted_class = class_names[class_index]

print(f'Predicted Disease: {predicted_class}')
print(f'Confidence: {confidence:.2f}')