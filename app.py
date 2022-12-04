from flask import Flask, render_template, request, jsonify, session, redirect, url_for, flash
from sqlalchemy import create_engine

app = Flask(__name__)
app.secret_key = "session_test"

@app.route('/')
def home():
    return render_template('index.html', component_name='main')

# login.html mapping
@app.route('/login')
def login_page():
    # 세션에 로그인 한 유저의 정보가 있다면? 루트로
    if 'user-info' in session:
        flash("이미 로그인된 유저입니다.")
        return redirect(url_for('home'))
    else :
        return render_template('index.html', component_name='login')

# register.html mapping
@app.route('/register')
def register_page():
    # 세션에 로그인 한 유저의 정보가 있다면? 루트로
    if 'user-info' in session:
        flash("이미 가입된 유저입니다.")
        return redirect(url_for('home'))
    else :
        return render_template('index.html', component_name='register')

# write.html mapping
@app.route('/write')
def write_page():
    # 세션에 로그인 한 유저의 정보가 없다면? 로그인 페이지로
    if 'user-info' not in session:
        flash("로그인을 먼저 해주세요.")
        return redirect(url_for('login_page'))
    else:
        return render_template('index.html', component_name='write')

# login api
@app.route('/api/user-login', methods=['POST'])
def user_login():
    userId = request.form['id']
    userPw = request.form['pw']

    # 1. 아이디 있는지 없는지 판별
    sql_is_id_check = "SELECT * FROM user WHERE user_id = %s"
    rows = app.database.execute(sql_is_id_check, userId)

    user_data = []
    for record in rows:
        temp = {
            "id" : record[0],
            "user_id" : record[1],
            "user_pw" : record[2],
            "user_name" : record[3],
            "user_nickname" : record[4],
            "user_email" : record[5],
            "user_intro" : record[6],
            "signup_at" : record[7],     
        }
        user_data.append(temp)  

    if len(user_data) == 1 :
         # 2. 아이디는 있는데 비밀번호 비교
        if userPw == user_data[0]['user_pw'] :
            # 비밀번호가 같다면?
            # session
            session['user-info'] = user_data[0]
            return jsonify({'result' : "Login-Success"})
        else :
            # 비밀번호가 틀리다면?
            return jsonify({'result' : "Pw-Not-Correct"})
    else :
        # 일치하는 아이디가 없다면?
        return jsonify({'result' : "Id-Not-Found"}); 

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
            'id': record[0]
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