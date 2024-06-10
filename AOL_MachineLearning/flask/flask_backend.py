from flask_cors import CORS # type: ignore
from flask import Flask, request, jsonify
import pickle
import io
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import MinMaxScaler

with open('./RFHousePricingModel.h5', 'rb') as file:
    model = pickle.load(file)

with open('./label_encoders.pkl', 'rb') as f:
    label_encoders = pickle.load(f)
with open('./scalers.pkl', 'rb') as f:
    scalers = pickle.load(f)

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:5173"}})


@app.route('/predict', methods=['POST'])
def predict():
  data = request.json

  df = pd.DataFrame(data, index=[0])

  try :
    columns_to_convert = ['bedrooms', 'bathrooms', 'land_size_m2', 'building_size_m2', 'electricity', 'maid_bedrooms', 
                      'maid_bathrooms', 'floors', 'garages', 'carports']
  
    for column in columns_to_convert:
      df[column] = pd.to_numeric(df[column])

    df['district'] = label_encoders['district'].transform(df['district'])
    df['city'] = label_encoders['city'].transform(df['city'])
    df['property_type'] = label_encoders['property_type'].transform(df['property_type'])
    df['certificate'] = label_encoders['certificate'].transform(df['certificate'])
    df['property_condition'] = label_encoders['property_condition'].transform(df['property_condition'])
    df['furnishing'] = label_encoders['furnishing'].transform(df['furnishing'])

    # Apply the scalers
    for column in ['district', 'city', 'lat', 'long', 'land_size_m2', 'building_size_m2', 'carports', 
                   'electricity', 'maid_bedrooms', 'maid_bathrooms', 'floors', 'garages', 'bedrooms', 
                   'bathrooms', 'certificate', 'property_condition', 'furnishing']:
        df[column] = scalers[column].transform(df[[column]])


    prediction = model.predict(df)

    print("prediction", prediction)

    return jsonify({'predictions': prediction.tolist()})
  
  except Exception as e:
    print(e)
    return jsonify({'error': str(e)})

if __name__ == '__main__':
  app.run(port=9999, debug=True)