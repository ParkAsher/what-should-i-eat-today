from flask import Flask, render_template, request, jsonify, session, redirect, url_for, flash
from sqlalchemy import create_engine
import boto3
import datetime
import bcrypt
import math


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
    except Exception as e:
        print(e)
    else:
        print("s3 bucket connected!")
        return s3


@app.route('/')
def home():
    return render_template('index.html', component_name='postlist')

######################
# login.html mapping #
######################
@app.route('/login')
def login_page():
    # 세션에 로그인 한 유저의 정보가 있다면? 루트로
    if 'user-info' in session:
        flash("이미 로그인된 유저입니다.")
        return redirect(url_for('home'))
    else:
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
    else:
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

#####################
# post.html mapping #
#####################
@app.route('/post')
def post_page():
    post_id = request.args.get('postid')

    #댓글 갯수 카운트
    sql="""
            SELECT COUNT(*) FROM Comments
            WHERE c_post_id = %s
        """
    rows = app.database.execute(sql, post_id)

    for record in rows:
        comment_list_count = record[0] 

    if comment_list_count / 5 == 0:
        comment_page = comment_list_count / 5
    else :
        comment_page = math.ceil(comment_list_count / 5)

    return render_template('index.html', component_name='post', post_id=post_id, comment_page=comment_page)    

#######################
# mypage.html mapping #
#######################
@app.route('/mypage')
def userinfo_page():
    if 'user-info' not in session:
        flash("로그인을 먼저 해주세요.")
        return redirect(url_for('login_page'))
    else:
        return render_template('index.html', component_name='mypage')

# login api
@app.route('/api/user-login', methods=['POST'])
def user_login():
    userId = request.form['id']
    userPw = request.form['pw']

    # 1. 아이디 있는지 없는지 판별
    sql_is_id_check = "SELECT * FROM Users WHERE user_id = %s"
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
            "signup_at" : record[6],     

        }
        user_data.append(temp)

    if len(user_data) == 1:
        # 2. 아이디는 있는데 비밀번호 비교
        if userPw == user_data[0]['user_pw']:
            # 비밀번호가 같다면?
            # session
            session['user-info'] = user_data[0]
            return jsonify({'result': "Login-Success"})
        else:
            # 비밀번호가 틀리다면?
            return jsonify({'result': "Pw-Not-Correct"})
    else:
        # 일치하는 아이디가 없다면?
        return jsonify({'result': "Id-Not-Found"})

################
# register api #
################
@app.route('/api/user-register', methods=['POST'])
def user_register():
    userNickname = request.form['nickname']
    userId = request.form['id']
    userPw = request.form['pw'].encode('utf-8')
    userName = request.form['name']
    userEmail = request.form['email']

    hashed_pw = bcrypt.hashpw(userPw, bcrypt.gensalt(rounds=10))

    sql = "INSERT INTO Users(user_nickname, user_id, user_pw, user_name, user_email, signup_at) VALUES (%s, %s, %s, %s, %s, %s)"

    app.database.execute(sql, (userNickname, userId, hashed_pw,
                         userName, userEmail, datetime.datetime.now())).lastrowid

    return jsonify({'msg': "등록성공!"})

######################
# nickname check api #
######################
@app.route('/api/check-nickname', methods=['POST'])
def user_nickname_check():
    userNickname = request.form['nickname']
    
    # WHERE 컬럼명 NOT IN (SELECT절)
    sql = "SELECT * FROM Users WHERE user_nickname = %s"

    rows = app.database.execute(sql, userNickname)

    user_list = []
    for record in rows:
        temp = {
            'nickname': record[0]
        }
        user_list.append(temp)

    if len(user_list) == 1:
        return jsonify({'check': False})
    else:
        return jsonify({'check': True})

################
# id check api #
################
@app.route('/api/check-id', methods=['POST'])
def user_id_check():
    userId = request.form['id']

    sql = "SELECT user_id FROM Users WHERE user_id = %s"

    rows = app.database.execute(sql, userId)

    user_list = []
    for record in rows:
        temp = {
            'id': record[0]
        }
        user_list.append(temp)

    if len(user_list) == 1:
        return jsonify({'check': False})
    else:
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

    sql = "INSERT INTO Posts(author, title, content, thumbnail, recommend, created_at) VALUES (%s, %s, %s, %s, %s, %s)"

    row = app.database.execute(
        sql, (author, title, content, thumbnail, 0, datetime.datetime.now())).lastrowid

    return jsonify({'msg': '등록성공!'})


###############
# file upload #
###############
@app.route('/api/file-upload', methods=['POST'])
def file_upload():
    file = request.files['file']

    filename = file.filename.split('.')[0]
    ext = file.filename.split('.')[-1]
    img_name = datetime.datetime.now().strftime(
        f"{filename}-%Y-%m-%d-%H-%M-%S.{ext}")

    # s3에 이미지파일 업로드
    s3_put_object(s3, 'what-should-i-eat-today', file, img_name)

    # 올라간 이미지의 url
    image_url = f'https://what-should-i-eat-today.s3.ap-northeast-2.amazonaws.com/{img_name}'

    return jsonify({'img_url': image_url})

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

#######################
# post detail get api #
#######################
@app.route("/api/post-detail", methods=["POST"])
def post_detail_get():
    post_id = request.form['post_id']

    sql = """
            SELECT p.id, u.user_id, u.user_nickname, p.title, p.content, p.created_at
            FROM Posts as p 
            LEFT JOIN Users as u 
            ON p.author = u.id 
            WHERE p.id = %s
        """

    rows = app.database.execute(sql, post_id)

    post_data_list = []
    for record in rows:
        temp = {
            'post_id': record[0],
            'user_id': record[1],
            'user_nickname': record[2],
            'post_title': record[3],
            'post_content': record[4],
            'post_created_at': record[5].strftime("%Y-%m-%d %H:%M:%S"),
        }
        post_data_list.append(temp)

    if len(post_data_list) == 1:
        # post_id 에 해당하는 게시글이 있으면?
        return jsonify({'success': True, 'post_detail': post_data_list})
    else:
        return jsonify({'success': False})

##########################
# post detail delete api #
##########################
@app.route("/api/post-detail/delete", methods=["POST"])
def post_detail_delete():
    post_id = request.form['post_id']

    sql = """
            DELETE FROM Posts 
            WHERE id = %s
        """

    row = app.database.execute(sql, post_id)

    return jsonify({'msg': '글 삭제완료!'})

####################
# comment save api #
####################
@app.route("/api/comment", methods=['POST'])
def comment_save():
    c_post_id = request.form['c_post_id']
    c_content = request.form['c_content']
    c_author = request.form['c_author']

    sql="""
            INSERT INTO Comments(c_author, c_content, created_at, c_post_id)
            VALUES (%s, %s, %s, %s)
        """
    
    row = app.database.execute(sql, (c_author, c_content, datetime.datetime.now(), c_post_id))

    return jsonify({'msg': '등록성공!'})   

###################
# comment get api #
###################
@app.route("/api/comment-list", methods=['GET'])
def get_comment_list():
    post_id = request.args.get('postid')
    page = request.args.get('page')

    comment_count = (int(page)-1) * 5
    
    sql="""
            SELECT u.user_id, u.user_nickname, c.c_content, c.created_at 
            FROM Comments as c
            LEFT JOIN Users as u
            ON c.c_author = u.id
            WHERE c_post_id = %s
            ORDER BY created_at desc
            LIMIT %s, 5
        """
    
    rows = app.database.execute(sql, (post_id, comment_count))

    comment_list=[]
    for record in rows:
        print(record)
        temp = {
            'c_author_id' : record[0],
            'c_author_nickname' : record[1],
            'c_content' : record[2],
            'created_at' : record[3].strftime("%Y-%m-%d %H:%M:%S")
        }
        comment_list.append(temp)  
    
    if len(comment_list) == 0:
        return jsonify({'success': False})
    
    return  jsonify({'success': True, 'comment_list': comment_list})

####################
# mypage patch api #
####################
    
@app.route("/api/user-info", methods=['PATCH'])
def patch_user_info():
    userNickname = request.form['nickname']
    userName = request.form['name']
    
    sql = "UPDATE INTO Users(user_nickname, user_name) VALUES (%s, %s)"

    app.database.execute(sql, (userNickname, userName)).lastrowid

    return jsonify({'msg': "수정완료!"})
    

if __name__ == '__main__':
    app.config.from_pyfile("config.py")
    database = create_engine(
        app.config['DB_URL'], encoding='utf-8', max_overflow=0)
    app.database = database

    # aws s3 connected
    s3 = s3_connection()

    app.run('0.0.0.0', port=5000, debug=True)



