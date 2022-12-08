$(document).ready(function () {
    let sort = new URL(location.href).searchParams.get('sort')

    if (sort === null) {
        sort = "newest"
    }
    $('.main-menu-left button[sort-type=' + sort + ']').addClass('main-menu-selected')


    get_post_list(1, sort);
})

function get_post_list(page, sort) {
    let pageNum = page; // string
    let sorted = sort;

    let Url = "/api/post-list?page=" + pageNum + "&sort=" + sorted;

    $.ajax({
        type: "GET",
        url: Url,
        success: function (response) {
            if (response['msg'] === "Posts-Not-Exist") {
                $('#post-list-err-msg').append("포스트가 존재하지 않습니다.")
                return;
            }

            // 에러메시지 지우기
            $('#post-list-err-msg').empty();
            $('#main-content').empty();

            $('.post-pagination').removeClass('page-selected');
            $('.post-pagination[data-index=' + page + ']').addClass('page-selected');

            for (let i = 0; i < response['post_list'].length; i++) {
                let temp = `
                    <div class="post-wrap">
                        <a href="/post?postid=${response['post_list'][i]['post_id']}">
                            <div class="post-thumbnail">
                                <img src="${response['post_list'][i]['post_thumbnail']}" alt="thumbnail" />
                            </div>
                            <div class="post-title">
                                <p>${response['post_list'][i]['post_title']}</p>
                            </div>
                            <div class="post-recommend">
                                <i class="bi bi-hand-thumbs-up-fill"></i>
                                <p>${response['post_list'][i]['post_recommend']}</p>
                            </div>
                            <div class="post-author">
                                <p>${response['post_list'][i]['user_nickname']}</p>
                            </div>
                            <div class="post-created-at">
                                <p>${response['post_list'][i]['created_at']}</p>
                            </div>
                        </a>
                    </div>
                `;
                $('#main-content').append(temp)
            }
        }
    })
}