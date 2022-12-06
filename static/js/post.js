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

            } else {
                alert("해당하는 번호의 글이 없습니다.")
                window.location.href = "/"
            }
        }
    })
}