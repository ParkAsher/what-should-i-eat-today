function my_post() {
    let id = $('#number').val();

    $.ajax({
        type: "GET",
        url: "/api/my-post?id=" + id,
        success: function (response) {

            if (response['success'] === false) {
                // 추천한 글이 없습니다.
                let temp = `
                    <tr>
                        <td>
                            ${response['msg']}
                        </td>
                    </tr>
                `
                $('#my_post_table').append(temp)
                return;
            }

            for (let i = 0; i < response['post_list'].length; i++) {
                let temp = `
                    <tr>
                        <td>${response['post_list'][i]['post_id']}</td>
                        <td>
                            <a href="/post?postid=${response['post_list'][i]['post_id']}">${response['post_list'][i]['post_title']}</a>
                        </td>
                        <td>${response['post_list'][i]['post_author_nickname']}</td>
                        <td>${response['post_list'][i]['post_created_at']}</td>
                    </tr>  
                `
                $('#my_post_table').append(temp)
            }
            return;
        }
    })
}

$(document).ready(function () {
    my_post();
})