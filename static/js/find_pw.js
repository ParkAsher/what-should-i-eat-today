function find_pw() {
    let userName = $('#user-name').val();
    let userId = $('#user-id').val();
    let userEmail = $('#user-email').val();

    //예외처리
    if (userName === "" || userId === "" || userEmail === "") {
        alert("빈칸을 채워주세요.")
        console.log()
        return;
    }

    $.ajax({
        type: "POST",
        url: "/api/find-user-pw",
        data: { name: userName, id: userId, email: userEmail },
        success: function (response) {
            alert("회원 정보가 일치하여 비밀번호 변경 페이지로 이동합니다.")
            window.location.href = "/update_pw"
            $('#find-pw-msg-suc').empty()
            $('#find-pw-msg-fail').empty()
            if (response['success'] === true) {
                // $('#find-pw-msg-suc').empty()
                $('#find-pw-msg-suc').css('color', 'blue')
                $('#find-pw-msg-suc').css('text-align', 'center')
            } else {
                // $('#find-pw-msg-fail').empty()
                $('#find-pw-msg-fail').css('color', 'red')
                $('#find-pw-msg-fail').css('text-align', 'center')
                $('#find-pw-msg-fail').append("존재하지 않는 회원 정보입니다.")
            }
        }
    })
}