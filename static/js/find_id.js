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
            let user_lists = response['user_id_find']
            $('#find-msg').empty()
            if (response['success'] === false) {
                // $('#find-msg').empty()
                $('#find-msg').css('color', 'red')
                $('#find-msg').css('text-align', 'center')
                $('#find-msg').append("존재하지 않는 회원 정보입니다.")
            } else {
                for ( i = 0; i < user_lists.length; i++) {
                // $('#find-msg').empty()
                $('#find-msg').css('color', 'blue')
                $('#find-msg').css('text-align', 'center')
                console.log(user_lists)
                $('#find-msg').append(user_lists[i]['user_id'] + '<br>')
                }
            }
        }
    })
}

