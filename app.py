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
    # 정렬 종류
    sort = request.args.get('sort')

    # 첫 로딩 시 최신순으로
    if sort == "" :
        sort = "newest"

    # 전체 게시글 수 넘겨주기
    sql="""
            SELECT count(*) FROM Posts
        """
    rows = app.database.execute(sql)

    for record in rows:
        post_list_count = record[0] 

    if post_list_count == 0:
        post_page = 0
    elif post_list_count % 8 == 0:
        post_page = post_list_count // 8
    else :
        post_page = math.ceil(post_list_count / 8)    

    return render_template('index.html', component_name='postlist', post_page=post_page, sort=sort)

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
# find_id.html mapping #
#########################
@app.route('/find_id')
def find_id_page():
    return render_template('index.html', component_name='find_id', user_lists="", len=0)

#########################
# find_pw.html mapping #
#########################
@app.route('/find_pw')
def find_pw_page():
    return render_template('index.html', component_name='find_pw')

#########################
# update_pw.html mapping #
#########################
@app.route('/update_pw')
def update_pw_page():
    return render_template('index.html', component_name='update_pw')

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
# edit.html mapping #
#####################
@app.route('/edit')
def edit_page():
    # 세션에 로그인 한 유저의 정보가 없다면? 로그인 페이지로
    if 'user-info' not in session:
        flash("로그인을 먼저 해주세요.")
        return redirect(url_for('login_page'))
    else:
        return render_template('index.html', component_name='edit')

#####################
# post.html mapping #
#####################
@app.route('/post')
def post_page():
    post_id = request.args.get('postid')

    # 댓글 갯수 카운트
    sql = """
            SELECT COUNT(*) FROM Comments
            WHERE c_post_id = %s
        """
    rows = app.database.execute(sql, post_id)

    for record in rows:
        comment_list_count = record[0]

    print(comment_list_count)

    if comment_list_count == 0 :
        comment_page = 0
    elif comment_list_count % 5 == 0 :
        comment_page = comment_list_count // 5
    else :
        comment_page = math.ceil(comment_list_count / 5)

    return render_template('index.html', component_name='post', post_id=post_id, comment_page=comment_page)


#######################
# mypage.html mapping #
#######################
@app.route('/mypage')
def mypage():
    if 'user-info' not in session:
        flash("로그인을 먼저 해주세요.")
        return redirect(url_for('login_page'))
    else:
        print(session['user-info'])
        return render_template('index.html', component_name='mypage')


#######################
# my_like_post mapping #
#######################
@app.route('/mypage/my_like_post')
def mypage_my_post():
    if 'user-info' not in session:
        flash("로그인을 먼저 해주세요.")
        return redirect(url_for('login_page'))
    else:
        print(session['user-info'])
        return render_template('index.html', component_name='mypage_like_post')


#######################
# my_post mapping #
#######################
@app.route('/mypage/my_post')
def mypage_upadate():
    if 'user-info' not in session:
        flash("로그인을 먼저 해주세요.")
        return redirect(url_for('login_page'))
    else:
        print(session['user-info'])
        return render_template('index.html', component_name='mypage_my_post')
        

#############
# login api #
#############
@app.route('/api/user-login', methods=['POST'])
def user_login():
    userId = request.form['id']
    userPw = request.form['pw'].encode('utf-8')

    # 1. 아이디 있는지 없는지 판별
    sql_is_id_check = "SELECT * FROM Users WHERE user_id = %s"
    rows = app.database.execute(sql_is_id_check, userId)

    user_data = []
    for record in rows:
        temp = {
            "id": record[0],
            "user_id": record[1],
            "user_pw": record[2].encode('utf-8'),
            "user_name": record[3],
            "user_nickname": record[4],
            "user_email": record[5],
            "signup_at": record[6],
        }
        user_data.append(temp)

    if len(user_data) == 1:
        # 2. 아이디는 있는데 비밀번호 비교
        if bcrypt.checkpw(userPw, (user_data[0]['user_pw'])):
            # if hashed_pw == user_data[0]['user_pw']:
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

###############
# find id api #
###############
@app.route('/api/find-user-id', methods=['POST'])
def find_id():
    userName = request.form['name']
    userEmail = request.form['email']

    # 1. 이름이 있는지 없는지 판별
    sql = "SELECT user_id FROM Users WHERE user_name = %s and user_email = %s"
    rows = app.database.execute(sql, (userName, userEmail))
    
    user_lists = []
    for record in rows:
        temp = {
            "user_id": record[0]
        }
        user_lists.append(temp)

    if len(user_lists) == 0:
        return jsonify({'success': False})
    else:
        return jsonify({'success': True, 'user_id_find': user_lists})

###############
# find pw api #
###############
@app.route('/api/find-user-pw', methods=['POST'])
def find_pw():
    userName = request.form['name']
    userId = request.form['id']
    userEmail = request.form['email']

    sql = "SELECT user_pw FROM Users WHERE user_name = %s and user_id = %s and user_email = %s"
    rows = app.database.execute(sql, (userName, userId, userEmail))
    
    user_list = []
    for record in rows:
        print(record)
        temp = {
            "user_pwimage.png": record[0]
        }
        user_list.append(temp)

    if len(user_list) == 0:
        return jsonify({'success': False})
    else:
        return jsonify({'success': True, 'user_pw_find': user_list})  
        

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
            SELECT p.id, u.user_id, u.user_nickname, p.title, p.content, p.created_at, p.recommend
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
            'post_recommend': record[6]
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

    sql = """
            INSERT INTO Comments(c_author, c_content, created_at, c_post_id)
            VALUES (%s, %s, %s, %s)
        """

    row = app.database.execute(
        sql, (c_author, c_content, datetime.datetime.now(), c_post_id))

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
            SELECT u.user_id, u.user_nickname, c.c_content, c.created_at, c.id 
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
        temp = {
            'c_author_id' : record[0],
            'c_author_nickname' : record[1],
            'c_content' : record[2],
            'created_at' : record[3].strftime("%Y-%m-%d %H:%M:%S"),
            'c_id' : record[4]
        }
        comment_list.append(temp)  
    
    if len(comment_list) == 0:
        return jsonify({'success': False})
    
    return  jsonify({'success': True, 'comment_list': comment_list})

######################
# comment delete api #
######################
@app.route("/api/comment-delete", methods=['DELETE'])
def comment_delete():
    c_id = request.args.get('cid')

    sql="""
            DELETE FROM Comments 
            WHERE id = %s 
        """
    
    app.database.execute(sql, int(c_id))

    return jsonify({'msg' : "삭제성공!"})
    
#############################
# get post list in main api #
#############################
@app.route("/api/post-list", methods=['GET'])
def get_post_list():
    page = request.args.get('page')
    sort = request.args.get('sort')

    post_count = (int(page)-1) * 8
    
    if sort == "recommend":
        # 추천순
        sql="""
            SELECT p.id, p.title, u.user_id, u.user_nickname, p.content, p.thumbnail, p.created_at, p.recommend
            FROM Posts as p
            LEFT JOIN Users as u
            ON p.author = u.id
            ORDER BY recommend DESC, created_at DESC
            LIMIT %s, 8
        """
        rows = app.database.execute(sql, (post_count))
    else :
        # 최신순
        sql="""
            SELECT p.id, p.title, u.user_id, u.user_nickname, p.content, p.thumbnail, p.created_at, p.recommend
            FROM Posts as p
            LEFT JOIN Users as u
            ON p.author = u.id
            ORDER BY created_at DESC
            LIMIT %s, 8
        """
        rows = app.database.execute(sql, (post_count))

    post_list=[]
    for record in rows:
        temp = {
            'post_id' : record[0],
            'post_title' : record[1],
            'user_id' : record[2],
            'user_nickname' : record[3],
            'post_content' : record[4],
            'post_thumbnail' : record[5],
            'created_at' : record[6].strftime("%Y-%m-%d %H:%M:%S"),
            'post_recommend' : record[7]
        }
        post_list.append(temp)

    if len(post_list) == 0 :
        return jsonify({'msg' : "Posts-Not-Exist"})
                

    return jsonify({'post_list': post_list})

####################
# mypage patch api #
####################
@app.route("/api/user-info", methods=['PATCH'])
def patch_user_info():
    userNickname = request.form['nickname']
    userName = request.form['name']
    idNumber = request.form['number']
    userId = request.form['id']
    
    sql = "UPDATE Users SET user_nickname = %s, user_name = %s WHERE id = %s"

    app.database.execute(sql, (userNickname, userName, int(idNumber))).lastrowid
    
    # 세션 삭제 
    # db에서 해당 유저 정보다찾아오기 
    # 세션에 수정 값 넣어주기
    session.clear()
    sql = "SELECT * FROM Users WHERE user_id = %s"
    rows = app.database.execute(sql, userId)

    user_data = []
    for record in rows:
        temp = {
            "id": record[0],
            "user_id": record[1],
            "user_pw": record[2].encode('utf-8'),  
            "user_name": record[3],
            "user_nickname": record[4],
            "user_email": record[5],
            "signup_at": record[6],
        }
        user_data.append(temp)

    session['user-info'] = user_data[0]
    print(session['user-info'])
    return jsonify({'msg': "수정완료!"})  

######################
# post recommend api #
######################
@app.route("/api/post-recommend", methods=['POST'])
def post_recommend():
    post_id = request.form['post_id']
    user_num = request.form['user_num']

    sql="""
            UPDATE Posts SET recommend = Posts.recommend + 1
            WHERE Posts.id = %s
        """
    
    app.database.execute(sql, post_id)

    sql2="""
            INSERT INTO Recommends(r_user, p_id)
            VALUES(%s, %s)
        """
    app.database.execute(sql2, (user_num, post_id))

    return({'msg' : "추천하였습니다!"})

############################
# is recommended check api #
############################
@app.route("/api/post-recommend/is-recommended-check", methods=['POST'])
def is_recommended_check():
    post_id = request.form['post_id']
    user_num = request.form['user_num']

    sql="""
            SELECT exists(SELECT * FROM Recommends WHERE p_id = %s AND r_user = %s)
        """

    rows = app.database.execute(sql, (post_id, user_num))

    for record in rows:
        is_recommended = record[0]

    return({'is_recommended' : is_recommended})

    
#################
# update_pw api #
#################
@app.route('/api/find-user-pw/update-pw', methods=['POST'])
def update_pw():
    newPw = request.form['user-pw-update'].encode('utf-8')
    newPwCheck = request.form['user-pw-update-check'].encode('utf-8')

    hashed_pw = bcrypt.hashpw(newPw, bcrypt.gensalt(rounds=10))

    sql = "UPDATE Users SET user_pw = %s"

    app.database.execute(sql, (hashed_pw)).lastrowid

    # 세션 삭제 
    # db에서 해당 유저 정보다찾아오기 
    # 세션에 수정 값 넣어주기
    session.clear()
    sql = "SELECT * FROM Users WHERE user_id = %s"
    rows = app.database.execute(sql, newPw)

    user_data = []
    for record in rows:
        temp = {
            "id": record[0],
            "user_id": record[1],
            "user_pw": record[2].encode('utf-8'),  
            "user_name": record[3],
            "user_nickname": record[4],
            "user_email": record[5],
            "signup_at": record[6],
        }
        user_data.append(temp)

    session['user-info'] = user_data[0]
    print(session['user-info'])

    return jsonify({'msg': "변경 성공!"})

########################
# my_like_post GET API #
########################
@app.route('/api/my_like_post', methods=['GET'])
def my_like_post():
    id = request.args.get('id')

    sql="""
            SELECT p.id, p.title, u.user_nickname, p.created_at
            FROM Recommends as r
            INNER JOIN Posts as p
            ON r.p_id = p.id
            INNER JOIN Users as u
            ON p.author = u.id
            WHERE r_user = %s;
        """
    rows = app.database.execute(sql)

    like_list=[]
    for record in rows:
        temp ={
            'r_id' : record[0],
            'r_title' : record[1],
            'r_user_nickname' : record[2],
            'r_create_at' : record[3] 
        }
        like_list.append(temp)



    return  jsonify({'success': True, 'like_list' : like_list})




if __name__ == '__main__':
    app.config.from_pyfile("config.py")
    database = create_engine(
        app.config['DB_URL'], encoding='utf-8', max_overflow=0)
    app.database = database

    # aws s3 connected
    s3 = s3_connection()

    app.run('0.0.0.0', port=5000, debug=True)