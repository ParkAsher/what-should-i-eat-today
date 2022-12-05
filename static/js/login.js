function login_user() {
    let userId = $('#user-id').val();
    let userPw = $('#user-pw').val();

    // 예외처리
    if (userId === "" || userPw === "") {
        alert("빈칸을 채워주세요.")
        return;
    }

    $.ajax({
        type: "POST",
        url: "/api/user-login",
        data: { id: userId, pw: userPw },
        success: function (response) {

            if (response['result'] === "Id-Not-Found") {
                // 1. 아이디가 없거나
                $('#login-err-msg-id').empty()
                $('#login-err-msg-pw').empty()

                $('#login-err-msg-id').css('color', 'red')
                $('#login-err-msg-id').append("존재하지 않는 아이디입니다.")
                return;
            }

            if (response['result'] === "Pw-Not-Correct") {
                // 2. 아이디는 맞았는데 비밀번호가 틀리거나
                $('#login-err-msg-id').empty()
                $('#login-err-msg-pw').empty()

                $('#login-err-msg-pw').css('color', 'red')
                $('#login-err-msg-pw').append("비밀번호가 일치하지 않습니다.")
                return;
            }

            if (response['result'] === "Login-Success") {
                // 로그인 성공
                window.location.href = "/"
            }
        }
    })

}