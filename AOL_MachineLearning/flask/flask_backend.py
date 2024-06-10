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

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:5173"}})


@app.route('/predict', methods=['POST'])
def predict():
  data = request.json
  # input_data = np.array([
  #   data['district'], 
  #   data['city'],
  #   data['latitude'],
  #   data['longitude'],
  #   data['property_type'],
  #   data['bedrooms'],
  #   data['bathrooms'],
  #   data['land_size_m2'],
  #   data['building_size_m2'],
  #   data['carports'],
  #   data['electricity'],
  #   data['maid_bedrooms'],
  #   data['maid_bathrooms'],
  #   data['floors'],
  #   data['garages'],
  #   data['certificate'],
  #   data['property_condition'],
  #   data['furnishing']
  # ])

  input_data = {
    'district': [data['district']],
    'city': [data['city']],
    'lat': [data['latitude']],
    'long': [data['longitude']],
    'property_type': [data['property_type']],
    'bedrooms': [data['bedrooms']],
    'bathrooms': [data['bathrooms']],
    'land_size_m2': [data['land_size_m2']],
    'building_size_m2': [data['building_size_m2']],
    'carports': [data['carports']],
    'electricity': [data['electricity']],
    'maid_bedrooms': [data['maid_bedrooms']],
    'maid_bathrooms': [data['maid_bathrooms']],
    'floors': [data['floors']],
    'garages': [data['garages']],
    'certificate': [data['certificate']],
    'property_condition': [data['property_condition']],
    'furnishing': [data['furnishing']]
  }

  df = pd.DataFrame(input_data)

  try :
    columns_to_convert = ['bedrooms', 'bathrooms', 'land_size_m2', 'building_size_m2', 'electricity', 'maid_bedrooms', 
                      'maid_bathrooms', 'floors', 'garages', 'carports']
  
    for column in columns_to_convert:
      df[column] = pd.to_numeric(df[column])

    le = LabelEncoder()

    df['district'] = le.fit_transform(df['district'])
    df['city'] = le.fit_transform(df['city'])
    df['property_type'] = le.fit_transform(df['property_type'])

    mm = MinMaxScaler(feature_range=[0,1])

    df['district'] = mm.fit_transform(df[['district']])
    df['city'] = mm.fit_transform(df[['city']])
    df['lat'] = mm.fit_transform(df[['lat']])
    df['long'] = mm.fit_transform(df[['long']])
    df['land_size_m2'] = mm.fit_transform(df[['land_size_m2']])
    df['building_size_m2'] = mm.fit_transform(df[['building_size_m2']])
    df['carports'] = mm.fit_transform(df[['carports']])
    df['electricity'] = mm.fit_transform(df[['electricity']])
    df['maid_bedrooms'] = mm.fit_transform(df[['maid_bedrooms']])
    df['maid_bathrooms'] = mm.fit_transform(df[['maid_bathrooms']])
    df['floors'] = mm.fit_transform(df[['floors']])
    df['garages'] = mm.fit_transform(df[['garages']])
    df['bedrooms'] = mm.fit_transform(df[['bedrooms']])
    df['bathrooms'] = mm.fit_transform(df[['bathrooms']])

    df['certificate'] = le.fit_transform(df['certificate'])
    df['property_condition'] = le.fit_transform(df['property_condition'])
    df['furnishing'] = le.fit_transform(df['furnishing'])

    df['certificate'] = mm.fit_transform(df[['certificate']])
    df['property_condition'] = mm.fit_transform(df[['property_condition']])
    df['furnishing'] = mm.fit_transform(df[['furnishing']])

    prediction = model.predict(df)

    print("prediction", prediction)

    return jsonify({'predictions': prediction.tolist()})
  
  except Exception as e:
    print(e)
    return jsonify({'error': str(e)})

if __name__ == '__main__':
  app.run(port=9999, debug=True)