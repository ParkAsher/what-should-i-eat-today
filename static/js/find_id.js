function find_id() {
    let userName = $('#user-name').val();
    let userEmail = $('#user-email').val();

    // 예외처리
    if (userName === "" || userEmail === "") {
        alert("빈칸을 채워주세요.")
        return;
    }

    $.ajax({
        type:"POST",
        url: "/api/find-user-id",
        data: { name: userName, email: userEmail },
        success: function (response) {

            if (response['result'] === "Name-Not-Found") {
                // 1. 이름이 없거나
                $('#find-err-msg-name').empty()
                $('#find-err-msg-email').empty()

                $('#find-err-msg-name').css('color', 'red')
                $('#find-err-msg-name').append("존재하지 않는 회원 이름입니다.")
                return;
            }

            if (response['result'] === "Email-Not-Correct") {
                // 2. 이름은 있는데 이메일이 틀렸거나
                $('#find-err-msg-name').empty()
                $('#find-err-msg-email').empty()

                $('#find-err-msg-email').css('color', 'red')
                $('#find-err-msg-email').append("이메일이 일치하지 않습니다.")
                return;
            }

            if (response['result'] === "Find-Success") {
                // 아이디 찾기 성공
                $('#find-scs-msg').css('color', 'blue')
                // append 메시지에 아이디 정보 전달??
                 $('#find-scs-msg').append("")
            }
        }
    })
}