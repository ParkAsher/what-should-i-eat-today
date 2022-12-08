// 비밀번호

function update_pw() {
    let newPw = $('#user-pw-update').val();
    let newPwCheck = $('#user-pw-update-check').val();
   
    let pwNumber = userPw.search(/[0-9]/g);
    let pwEnglish = userPw.search(/[a-z]/gi);
    let pwSpece = userPw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

    // 예외 처리 조건문
    if (userPw === "") {
        alert("비밀번호를 입력해주세요.")
        return;
    }
    if (pwNumber < 0 || pwEnglish < 0 || pwSpece < 0) {
        alert("비밀번호는 영문,숫자,특수문자를 혼합하여 입력해주세요.");
        return;
    }
    if (userPw.length < 8 || userPw.length > 20) {
        alert("비밀번호는 8자리 ~ 20자리 이내로 입력해주세요.");
        return;
    }

    if (userPw !== userPwCheck) {
        $("#check-msg").css('display', 'block');
        $("#check-msg").append("비밀번호가 일치하지 않습니다.");
        return;
    }
    if (userPw.search(/\s/) != -1) {
        alert("입력란에 공백(스페이스바)이 존재합니다. 다시 작성해주세요.");
        return;
    }

    $.ajax({
        type: "POST",
        url: "/api/find-user-pw/update-pw",
        data: { pw: newPw },
        success: function (response) {
            alert(response['msg']);
            window.location.href = "/"
        }
    })
}