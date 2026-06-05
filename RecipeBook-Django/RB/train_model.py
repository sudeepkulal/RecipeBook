import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# Get the path to the CSV file
current_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(current_dir, 'mood_situation_dish.csv')

# Load the dataset
data = pd.read_csv(file_path)

# Encode the 'Mood', 'Situation', and 'Recommended Dish Type'
mood_encoder = LabelEncoder()
situation_encoder = LabelEncoder()
dish_encoder = LabelEncoder()

data['Mood'] = mood_encoder.fit_transform(data['Mood'])
data['Situation'] = situation_encoder.fit_transform(data['Situation'])
data['Recommended Dish Type'] = dish_encoder.fit_transform(data['Recommended Dish Type'])

# Features and target
X = data[['Mood', 'Situation']]
y = data['Recommended Dish Type']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the Random Forest model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the model and encoders
joblib.dump(model, os.path.join(current_dir, 'mood_situation_model.pkl'))
joblib.dump(mood_encoder, os.path.join(current_dir, 'mood_encoder.pkl'))
joblib.dump(situation_encoder, os.path.join(current_dir, 'situation_encoder.pkl'))
joblib.dump(dish_encoder, os.path.join(current_dir, 'dish_encoder.pkl'))

print("Model trained and saved successfully!")
