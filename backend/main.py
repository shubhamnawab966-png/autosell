from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

PORT = int(os.getenv('PORT', 5000))

@app.route('/', methods=['GET'])
def home():
    return {'status': 'AutoSell Backend Running ✅'}

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=PORT)