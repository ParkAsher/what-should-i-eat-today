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
            if (response['success'] === false) {
                $('#find-msg').empty()
                $('#find-msg').css('color', 'red')
                $('#find-msg').css('text-align', 'center')
                $('#find-msg').append("존재하지 않는 회원입니다.")
            } else {
                $('#find-msg').empty()
                $('#find-msg').css('color', 'blue')
                $('#find-msg').css('text-align', 'center')
                $('#find-msg').append(response['user_id_find'][0]["user_id"])
            }
    
        }
    })
}