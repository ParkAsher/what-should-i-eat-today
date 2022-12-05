// 비밀번호 중복 체크

function register() {
    let userNickname = $('#user-nickname').val()
    let userId = $('#user-id').val();
    let userPw = $('#user-pw').val();
    let userPwCheck = $('#user-pw-check').val();
    let userName = $('#user-name').val();
    let userEmail = $('#user-email').val();

    let nickname = userNickname.search(/[ㄱ-ㅎ|ㅏ-ㅣ]/g);
    
    let idKorean = userId.search(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g);
    let idSpace = userId.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

    let pwNumber = userPw.search(/[0-9]/g);
    let pwEnglish = userPw.search(/[a-z]/gi);
    let pwSpece = userPw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

    let nameNumber = userName.search(/[0-9]/g);
    let nameSpace = userName.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

    // 이메일 기본 정규식
    // let emailCheck = userEmail.search(/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i);

    // RFC 5322 이메일 형식 강화형
    let emailCheck = userEmail.search(/^[-0-9A-Za-z!#$%&'*+/=?^_`{|}~.]+@[-0-9A-Za-z!#$%&'*+/=?^_`{|}~]+[.]{1}[0-9A-Za-z]/i);

    console.log($('#user-nickname').attr('valid'))
    // 예외 처리 조건문
    if (userNickname === "") {
        alert("닉네임을 입력해주세요.")
        return;
    }
    if (userNickname.length < 2 || userNickname.length > 12) {
        alert("닉네임은 2자리 ~ 12자리 이내로 입력해주세요.");
        return;
    }
    if (nickname > -1){
        alert("올바르지 못한 닉네임 형식입니다.")
    }
    if (userId === "") {
        alert("아이디를 입력해주세요.")
        return;
    }
    if (idSpace > -1 || idKorean > -1) {
        alert("아이디는 한글 또는 특수 기호(*)가 포함될 수 없습니다.");
        return;
    }
    if (userId.length < 5 || userId.length > 20) {
        alert("아이디는 5자리 ~ 20자리 이내로 입력해주세요.");
        return;
    }
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
    if (userName === "") {
        alert("이름을 입력해주세요.")
        return;
    }
    if (nameNumber > -1 || nameSpace > -1) {
        alert("이름은 한글 또는 영어만 입력 가능합니다.");
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
    if (emailCheck !== 0){
        alert("알맞는 이메일 형식이 아닙니다.")
        console.log(emailCheck)
        return;
    }
    if (userPw !== userPwCheck) {
        $("#check-msg").css('display', 'block');
        $("#check-msg").append("비밀번호가 일치하지 않습니다.");
        return;
    }
    if (userNickname.search(/\s/) != -1 || userId.search(/\s/) != -1 || userPw.search(/\s/) != -1 || userName.search(/\s/) != -1 || userEmail.search(/\s/) != -1) {
        alert("입력란에 공백(스페이스바)이 존재합니다. 다시 작성해주세요.");
        return ;
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