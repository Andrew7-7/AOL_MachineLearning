from flask_cors import CORS # type: ignore
from flask import Flask, request, jsonify
import pickle
import io
import numpy as np

with open('./RFHousePricingModel.h5', 'rb') as file:
    model = pickle.load(file)

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:5173"}})


@app.route('/predict', methods=['POST'])
def predict():
  data = request.json
  input_data = np.array([
    data['district'], 
    data['city'],
    data['latitude'],
    data['longitude'],
    data['property_type'],
    data['bedrooms'],
    data['bathrooms'],
    data['land_size_m2'],
    data['building_size_m2'],
    data['carports'],
    data['electricity'],
    data['maid_bedrooms'],
    data['maid_bathrooms'],
    data['floors'],
    data['garages'],
    data['certificate'],
    data['property_condition'],
    data['furnishing']
  ])
  print(input_data)
  try :
    print("tes")
  
  except Exception as e:
    return jsonify({'error': str(e)})

if __name__ == '__main__':
  app.run(port=9999, debug=True)