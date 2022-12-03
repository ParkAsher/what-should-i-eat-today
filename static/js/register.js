// 비밀번호 중복 체크

function register() {
    let userNickname = $('#user-nickname').val()
    let userId = $('#user-id').val();
    let userPw = $('#user-pw').val();
    let userName = $('#user-name').val();
    let userEmail = $('#user-email').val();

    let userPwCheck = $('#user-pw-check').val();

    console.log($('#user-nickname').attr('valid'))
    // 예외 처리
    if (userNickname === "") {
        alert("닉네임을 입력해주세요.")
        return;
    }
    if (userId === "") {
        alert("아이디를 입력해주세요.")
        return;
    }
    if (userPw === "") {
        alert("비밀번호를 입력해주세요.")
        return;
    }
    if (userName === "") {
        alert("이름을 입력해주세요.")
        return;
    }
    if ($('#user-nickname').attr('valid') == "default" || $('#user-id').attr('valid') == "default") {
        alert("닉네임과 아이디의 중복체크를 진행해주세요.")
        return;
    }
    if ($('#user-nickname').attr('valid') == "false" || $('#user-id').attr('valid') == "false") {
        alert("사용가능한 닉네임과 아이디를 입력해주세요.")
        return;
    }
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
                $('#user-nickname').attr('valid', "true")
                $('#nickname-check-msg').empty()
                $('#nickname-check-msg').css('color', 'blue')
                $('#nickname-check-msg').append("사용가능한 닉네임입니다.")
            } else {
                $('#user-nickname').attr('valid', "false")
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
                $('#user-id').attr('valid', "true")
                $('#id-check-msg').empty()
                $('#id-check-msg').css('color', 'blue')
                $('#id-check-msg').append("사용가능한 아이디입니다.")
            } else {
                $('#user-id').attr('valid', "false")
                $('#id-check-msg').empty()
                $('#id-check-msg').css('color', 'red')
                $('#id-check-msg').append("이미 존재하는 아이디입니다.")
            }
        }
    })

}