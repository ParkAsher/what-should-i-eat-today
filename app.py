from flask import Flask, render_template, request, jsonify
from sqlalchemy import create_engine

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html', component_name='main')

# login.html mapping
@app.route('/login')
def login_page():
    return render_template('index.html', component_name='login')


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)