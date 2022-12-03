// 비밀번호 중복 체크

function register() {
    let userNickname = $('#user-nickname').val()
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
        data: { nickname: userNickname, id: userId, pw: userPw, name: userName, email: userEmail },
        success: function (response) {
            alert(response['msg']);
            window.location.href = "/";
        }
    })
}

// 닉네임 중복체크
function user_nickname_check() {
    let userNickname = $('#user-nickname').val();

    $.ajax({
        type: "POST",
        url: "/api/check-nickname",
        data: { nickname: userNickname },
        success: function (response) {
            let check = response['check']

            console.log(check);
            if (check === true) {
                $('#nickname-check-msg').empty()
                $('#nickname-check-msg').css('color', 'blue')
                $('#nickname-check-msg').append("사용가능한 닉네임입니다.")
            } else {
                $('#nickname-check-msg').empty()
                $('#nickname-check-msg').css('color', 'red')
                $('#nickname-check-msg').append("이미 존재하는 닉네임입니다.")
            }
        }
    })

}

// 아이디 중복체크
function user_id_check() {
    let userId = $('#user-id').val();

    $.ajax({
        type: "POST",
        url: "/api/check-id",
        data: { id: userId },
        success: function (response) {
            let check = response['check']

            console.log(check);
            if (check === true) {
                $('#id-check-msg').empty()
                $('#id-check-msg').css('color', 'blue')
                $('#id-check-msg').append("사용가능한 아이디입니다.")
            } else {
                $('#id-check-msg').empty()
                $('#id-check-msg').css('color', 'red')
                $('#id-check-msg').append("이미 존재하는 아이디입니다.")
            }
        }
    })

}