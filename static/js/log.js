$(document).ready(function () {
    let user_num = $('#user_num').val()
    if (user_num) {
        get_log(user_num);
    }
})

function get_log(user_num) {
    $.ajax({
        type: 'GET',
        url: '/api/get-log?id=' + user_num,
        success: function (response) {
            console.log(response['log'])
            $('#user-login-log').append(response['log']['user_login_log'])
            $('#user-post-count').append(response['log']['user_post_count'])
            $('#user-comment-count').append(response['log']['user_comment_count'])
        }
    })
}