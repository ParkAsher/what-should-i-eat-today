function register() {
    let password = $('#password').val();
    let passwordCheck = $('#password-check').val()

    if (password !== passwordCheck) {
        $("#check-msg").css('display', 'block');
        $("#check-msh").append("비밀번호가 일치하지 않습니다.");
        return;
    }

    let userId = $('#user-id').val();
    let userPw = $('#password').val();
    let userName = $('#user-name').val();
    let userEmail = $('#user-email').val();

    $.ajax({
        type: "POST",
        url: "/api/user-register",
        data: { id: userId, pw: userPw, name: userName, email: userEmail },
        success: function(response){
            alert(response['msg']);
            window.location.href = "/";
        }
    })
}