from flask import Flask
from flask_cors import CORS
from cj_routes import cj_bp
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

app.register_blueprint(cj_bp)

@app.route('/')
def home():
    return {"status": "AutoSell Backend Running ✅"}

if __name__ == '__main__':
    app.run(debug=True, port=5000)