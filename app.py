from flask import Flask, render_template, request, jsonify
from sqlalchemy import create_engine

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)