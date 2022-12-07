$(document).ready(function () {
    get_post_detail();
    get_comment_list(1)
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

function comment_submit() {
    // 글 번호
    let postId = $('#post-id').val();
    // 댓글 내용
    let commentContent = $('#comment-content').val();
    // 작성자
    let loginedUserNum = $('#logined-user-num').val();

    $.ajax({
        type: "POST",
        url: "/api/comment",
        data: { c_post_id: postId, c_content: commentContent, c_author: loginedUserNum },
        success: function (response) {
            alert(response['msg']);
            window.location.reload();
        }
    })
}

function get_comment_list(page) {
    // 글 번호
    let postId = $('#post-id').val();
    let pageNum = page; // string

    let Url = "/api/comment-list?postid=" + postId + "&page=" + pageNum;
    $('#comment-list').empty();
    $('.comment-pagination').removeClass('page-selected');
    $('.comment-pagination[data-index=' + page + ']').addClass('page-selected');

    $.ajax({
        type: "GET",
        url: Url,
        success: function (response) {
            if (response['success'] === false) {
                return;
            }

            for (let i = 0; i < response['comment_list'].length; i++) {
                let temp = `
                    <div class="comment">
                        <div class="comment-info-wrap">
                            <div class="comment-info">
                                <span class="comment-author">${response['comment_list'][i]['c_author_nickname']}</span>
                                <span class="comment-created-at">${response['comment_list'][i]['created_at']}</span>
                            </div>
                            <div class="comment-btn">
                                <button type="button" class="comment-edit-btn">수정</button>
                                <button type="button" class="comment-delete-btn">삭제</button>
                            </div>
                        </div>                        
                        <div class="comment-content">
                            <p>${response['comment_list'][i]['c_content']}</p>
                        </div>
                    </div>
                `;
                $('#comment-list').append(temp)
                // button 의 data-index속성의 값                
            }
        }
    })
}