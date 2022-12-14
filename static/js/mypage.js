// 회원 정보 업데이트
function mypage() {
    let userNickname = $('#user-nickname').val();
    let userName = $('#user-name').val();
    let userId = $('#user-id').val();

    let nickname = userNickname.search(/[ㄱ-ㅎ|ㅏ-ㅣ]/g);
    
    let nameNumber = userName.search(/[0-9]/g);
    let nameSpace = userName.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

    let idNumber = $('#number').val();

    // 예외 처리
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
    if ($('#user-nickname').attr('valid') == "default") {
        alert("닉네임의 중복체크를 진행해주세요.")
        return;
    }
    if ($('#user-nickname').attr('valid') == "false") {
        alert("사용 가능한 닉네임을 입력해주세요.") 
        return;
    }
    if (userNickname.search(/\s/) != -1 || userName.search(/\s/) != -1) {
        alert("입력란에 공백(스페이스바)이 존재합니다. 다시 작성해주세요.");
        return;
    }

    $.ajax({
        type: "PATCH",
        url: "/api/user-info",
        data: { nickname: userNickname, name: userName, number: idNumber, id: userId},
        success: function (response) {
            alert(response['msg']);
            window.location.href = "/";
        }
    })
    
}

// 닉네임 체크박스 활성 | 비활성
function check_box() {

    if (document.getElementById("user-nickname").value === "" || document.getElementById("user-nickname").value === $('#nickname').val()) {
        document.getElementById("btn").disabled = true;
    }
    else {
        document.getElementById("btn").disabled = false;
        return;
    }
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
                $('#nickname-check-msg').append("이미 사용중인 닉네임입니다.")
            }
        }
    })

}

