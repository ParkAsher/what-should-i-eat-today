function find_pw() {
    let userName = $('#user-name').val();
    let userId = $('#user-id').val();
    let UserEmail = $('#user-email').val();

    //예외처리
    if (userName === "" || userId === "" || UserEmail === "") {
        alert("빈칸을 채워주세요.")
        return;
    }

    $.ajax({
        type: "POST",
        url: "/api/find-user-pw",
        data: { name: userName, id: userId, email: UserEmail },
        success: function (response) {
            if (response['success'] === false) {
                $('#find-pw-msg').empty()
                $('#find-pw-msg').css('color', 'red')
                $('#find-pw-msg').css('text-align', 'center')
                $('#find-pw-msg').append("존재하지 않는 회원입니다.")
            } else {
                $('#find-pw-msg').empty()
                $('#find-pw-msg').css('color', 'blue')
                $('#find-pw-msg').css('text-align', 'center')
                $('#find-pw-msg').append(response['user_pw_find'][0]["user_pw"])
            }
        }
    })
}