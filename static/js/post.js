$(document).ready(function () {
    get_post_detail();

})

function get_post_detail() {
    let postId = $('#post-id').val();

    $.ajax({
        type: "POST",
        url: "/api/post-detail",
        data: { post_id: postId },
        success: function (response) {

            if (response['success']) {
                let postData = response['post_detail'][0];
                let postTitle = postData['post_title'];
                $('#detail-title').append(postTitle);

                let postAuthor = postData['user_nickname'];
                $('#detail-author').append(postAuthor);

                let postCreatedAt = postData['post_created_at'];
                $('#detail-date').append(postCreatedAt)

                let postContent = postData['post_content'];
                $('#detail-content').append(postContent)

                // 수정, 삭제를 로그인되어있는 해당 글의 글 작성자만 볼수있게 처리
                let postAuthorId = postData['user_id'];
                let loginedUserId = $('#logined-user-id').val();
                if (postAuthorId !== loginedUserId) {
                    $('.post-btn-right').css('display', 'none');
                }

            } else {
                alert("해당하는 번호의 글이 없습니다.")
                window.location.href = "/"
            }
        }
    })
}

function post_delete() {
    let postId = $('#post-id').val();

    $.ajax({
        type: "POST",
        url: "/api/post-detail/delete",
        data: { post_id: postId },
        success: function (response) {
            alert(response['msg'])
            window.location.href = "/"
        }
    })
}