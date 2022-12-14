// quill image handler
function imageHandler() {
    const input = document.createElement("input");

    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = function () {
        const formData = new FormData();
        const file = $(this)[0].files[0];

        formData.append('file', file);

        $.ajax({
            type: "POST",
            url: "/api/file-upload",
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            success: function (response) {
                let img_url = response['img_url'];

                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', img_url)
            }
        })
    }
}
// quill init function
function quillInit() {
    let options = {
        modules: {
            imageResize: {
                displaySize: true
            },
            toolbar: {
                container: [
                    [{ 'font': [] }, { 'size': [] }],
                    [{ 'header': 1 }, { 'header': 2 }],
                    ['bold', 'underline', 'strike', 'blockquote', 'code-block'],
                    [{ 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' },],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
                    ['link', 'image'],
                ],
                handlers: {
                    image: imageHandler(),
                },
            }
        },
        theme: 'snow',
    };
    quill = new Quill('#editor', options);
    quill.getModule('toolbar').addHandler('image', function () {
        imageHandler();
    });
    quill.on('text-change', function () {
        document.getElementById("edit-content").value = quill.root.innerHTML;
    })
}
// thumbnail upload
function upload_image(e) {

    const file = e.target.files[0];

    const formData = new FormData();
    formData.append('file', file);

    $.ajax({
        type: "POST",
        url: "/api/file-upload",
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            let img_url = response['img_url'];
            $('.thumbnail-wrap').css('display', 'block');
            $('#thumbnail-img').attr('src', img_url);

            $('#edit-image').attr('value', img_url);
        }
    })
}
// ??? ??????
function edit_submit() {
    // ??? ??????
    let postId = new URL(location.href).searchParams.get('postid')
    // ??? ??????
    let title = $('#edit-title').val();
    // ?????????
    let thumbnail = $('#edit-image').attr('value');
    // ??? ??????
    let content = $('#edit-content').val();

    if (title === "") {
        alert("????????? ??????????????????.")
        return;
    }
    if (content === "") {
        alert("????????? ??????????????????")
        return;
    }

    $.ajax({
        type: "PATCH",
        url: "/api/post-edit",
        data: { postid: postId, title: title, thumbnail: thumbnail, content: content },
        success: function (response) {
            alert(response['msg'])
            window.location.href = '/post?postid=' + postId;
            return;
        }
    })
}


$(document).ready(function () {
    quillInit();

    // thumnail upload to AWS S3
    $("#edit-image").on("change", upload_image);

    // ??? ????????? ??????????????? ??? ?????? ?????? ????????????
    // ??? ??????
    let postId = new URL(location.href).searchParams.get('postid')
    $.ajax({
        type: "GET",
        url: "/api/edit-detail?postid=" + postId,
        success: function (response) {
            if (response['success'] = false) {
                alert(response['msg']);
                window.location.href = '/';
                return;
            }

            $('#edit-title').attr('value', response['post_detail'][0]['post_title']);
            $('#edit-image').attr('value', response['post_detail'][0]['post_thumbnail']);
            $('.ql-editor').html(response['post_detail'][0]['post_content'])
            return;
        }
    })
})