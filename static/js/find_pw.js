function find_pw() {
    let userName = $('#user-name').val();
    let userId = $('#user-id').val();
    let userEmail = $('#user-email').val();

    //예외처리
    if (userName === "" || userId === "" || userEmail === "") {
        alert("빈칸을 채워주세요.")
        return;
    }

    $.ajax({
        type: "POST",
        url: "/api/find-user-pw",
        data: { name: userName, id: userId, email: userEmail },
        success: function (response) {
            $('#find-pw-msg-suc').empty()
            $('#find-pw-msg-fail').empty()
            if (response['success'] === false) {
                $('#find-pw-msg-fail').css('color', 'red')
                $('#find-pw-msg-fail').css('text-align', 'center')
                $('#find-pw-msg-fail').append("존재하지 않는 회원 정보입니다.")
            } else (
                window.location.href="/update_pw"
            )
        }
    })
}