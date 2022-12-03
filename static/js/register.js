// 비밀번호 중복 체크

function register() {
    let userNickName = $('#user-nickname').val();
    let userId = $('#user-id').val();
    let userPw = $('#user-pw').val();
    let userName = $('#user-name').val();
    let userEmail = $('#user-email').val();

    let userPwCheck = $('#user-pw-check').val();

    if (userPw !== userPwCheck) {
        $("#check-msg").css('display', 'block');
        $("#check-msg").append("비밀번호가 일치하지 않습니다.");
        return;
    }

    $.ajax({
        type: "POST",
        url: "/api/user-register",
        data: {nickname: userNickName, id: userId, pw: userPw, name: userName, email: userEmail },
        success: function(response){
            alert(response['msg']);
            window.location.href = "/";
        }
    })
}

// 닉네임 중복 체크

function user_nickname_check(){
    let userNickName = $('#user-nickname').val();

    $.ajax({
        type: "POST",
        url: "/ap/check-nickname",
        data: { nickname: userNickName },
        success: function(response) {
            let check = response['check']

            if (check === true){
                $('#nickname-check-msg').empty()
                $('#nickname-check-msg').css('color', 'blue')
                $('#nickname-check-msg').append("사용 가능한 닉네임입니다.")
            } else{
                $('#nickname-check-msg').empty()
                $('#nickname-check-msg').css('color', 'red')
                $('#nickname-check-msg').append("사용 불가능한 닉네임입니다.")
            }
        }
    })
}