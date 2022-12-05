from flask import Flask, render_template, request, jsonify, session, redirect, url_for, flash
from sqlalchemy import create_engine
import boto3
import datetime

app = Flask(__name__)
app.secret_key = "session_test"

##################
# aws s3 connect #
##################
def s3_connection():
    try:
        s3 = boto3.client(
            service_name="s3",
            region_name="ap-northeast-2",
            aws_access_key_id="AKIAUJLR4DBQHDDEG25B",
            aws_secret_access_key="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"
        )
    except Exception as e :
        print(e)
    else:
        print("s3 bucket connected!")
        return s3

@app.route('/')
def home():
    return render_template('index.html', component_name='main')

######################
# login.html mapping #
######################
@app.route('/login')
def login_page():
    # 세션에 로그인 한 유저의 정보가 있다면? 루트로
    if 'user-info' in session:
        flash("이미 로그인된 유저입니다.")
        return redirect(url_for('home'))
    else :
        return render_template('index.html', component_name='login')

##################
# logout mapping #
##################
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))

#########################
# register.html mapping #
#########################
@app.route('/register')
def register_page():
    # 세션에 로그인 한 유저의 정보가 있다면? 루트로
    if 'user-info' in session:
        flash("이미 가입된 유저입니다.")
        return redirect(url_for('home'))
    else :
        return render_template('index.html', component_name='register')

######################
# write.html mapping #
######################
@app.route('/write')
def write_page():
    # 세션에 로그인 한 유저의 정보가 없다면? 로그인 페이지로
    if 'user-info' not in session:
        flash("로그인을 먼저 해주세요.")
        return redirect(url_for('login_page'))
    else:
        return render_template('index.html', component_name='write')

#############
# login api #
#############
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

################
# register api #
################
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

######################
# nickname check api #
######################
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

################
# id check api #
################
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

###################
# post write api #
###################
@app.route('/api/post-write', methods=['POST'])
def post_write():
    title = request.form['title']
    author = request.form['author']
    thumbnail = request.form['thumbnail']
    content = request.form['content']

    sql = "INSERT INTO post(author, title, content, thumbnail, recommend, created_at) VALUES (%s, %s, %s, %s, %s, %s)"

    row = app.database.execute(sql, (author, title, content, thumbnail, 0, datetime.datetime.now())).lastrowid
    
    return jsonify({'msg': '등록성공!'})


###############    
# file upload #
###############
@app.route('/api/file-upload', methods=['POST'])
def file_upload():
    file = request.files['file']

    filename = file.filename.split('.')[0]
    ext = file.filename.split('.')[-1]
    img_name = datetime.datetime.now().strftime(f"{filename}-%Y-%m-%d-%H-%M-%S.{ext}")

    # s3에 이미지파일 업로드
    s3_put_object(s3, 'what-should-i-eat-today', file, img_name)

    # 올라간 이미지의 url
    image_url = f'https://what-should-i-eat-today.s3.ap-northeast-2.amazonaws.com/{img_name}'

    return jsonify({'img_url' : image_url})

##########################
# image insert to aws s3 #
##########################
def s3_put_object(s3, bucket, file, filename):
    try:
        s3.put_object(
            Body=file,
            Bucket=bucket,
            Key=f'{filename}',
            ContentType="image/*",
            ACL='public-read'
        )
    except Exception as e:
        print(e)
        return False    
    return True

if __name__ == '__main__':
    app.config.from_pyfile("config.py")
    database = create_engine(app.config['DB_URL'], encoding='utf-8', max_overflow=0)
    app.database = database

    # aws s3 connected
    s3 = s3_connection()

    app.run('0.0.0.0', port=5000, debug=True)