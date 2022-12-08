function my_like_post() {
    let id = $('#number').val();

    $.ajax({
        type: "GET",
        url: "/api/my_like_post",
        data: { id : id },
        success: function (response) {
            for (let i = 0; i < response['like_list'].length; i++) {

                console.log(response['like_list'])
                
                let temp = `
                <tr>
                    <td>${response['like_list'][i]['post_id']}</td>
                    <td>${response['like_list'][i]['post_id']}</td>
                    <td>${response['like_list'][i]['post_id']}</td>
                    <td>${response['like_list'][i]['post_id']}</td>
                </tr>    
            `;
            $('#like_list').append(temp)
            console.log($('#like_list'))
            }
        }
    })
}