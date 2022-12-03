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

# register.html mapping
@app.route('/register')
def register_page():
    return render_template('index.html', component_name='register')

# write.html mapping
@app.route('/write')
def write_page():
    return render_template('index.html', component_name='write')

# register api
@app.route('/api/user-register', methods=['POST'])
def user_register():
    userNickname = request.form['nickname']
    userId = request.form['id']
    userPw = request.form['pw']
    userName = request.form['name']
    userEmail = request.form['email']

    sql = "INSERT INTO user(user_nickname, user_id, user_pw, user_name, user_email) VALUES (%s, %s, %s, %s, %s)"

    app.database.execute(sql, (userNickname, userId, userPw, userName, userEmail)).lastrowid

    return jsonify({'msg' : "등록성공!"})

# nickname_check api
@app.route('/api/check-nickname', methods=['POST'])
def user_nickname_check():
    userNickname = request.form['nickname']

    sql = "SELECT user_nickname FROM user WHERE user_nickname = %s"

    rows = app.database.execute(sql, userNickname)

    user_list = []
    for record in rows:
        temp = {
            'nickname': record[0]
        }
        user_list.append(temp)

    if len(user_list) == 1 :
        return jsonify({'check' : False})
    else :
        return jsonify({'check': True})

# id_check api
@app.route('/api/check-id', methods=['POST'])
def user_id_check():
    userId = request.form['id']

    sql = "SELECT user_id FROM user WHERE user_id = %s"

    rows = app.database.execute(sql, userId)

    user_list = []
    for record in rows:
        temp = {
            'nickname': record[0]
        }
        user_list.append(temp)

    if len(user_list) == 1 :
        return jsonify({'check' : False})
    else :
        return jsonify({'check': True})
    


if __name__ == '__main__':

    app.config.from_pyfile("config.py")

    database = create_engine(app.config['DB_URL'], encoding='utf-8', max_overflow=0)
    app.database = database

    app.run('0.0.0.0', port=5000, debug=True)