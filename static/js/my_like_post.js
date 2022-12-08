function my_like_post() {
    let id = $('#number').val();

    $.ajax({
        type: "GET",
        url: "/api/my-like-post?id=" + id,
        success: function (response) {

            if (response['success'] === false) {
                // 추천한 글이 없습니다.
                return;
            }

            for (let i = 0; i < response['recommend_list'].length; i++) {
                let temp = `
                    <tr>
                        <td>${response['recommend_list'][i]['post_id']}</td>
                        <td>${response['recommend_list'][i]['post_title']}</td>
                        <td>${response['recommend_list'][i]['post_author_nickname']}</td>
                        <td>${response['recommend_list'][i]['post_created_at']}</td>
                    </tr>  
                `
                $('#my_like_table').append(temp)
            }
            return;
        }
    })
}

$(document).ready(function () {
    my_like_post();
})
