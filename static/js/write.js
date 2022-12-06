// quill editor config
// quill editor image hanler
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
                quill.insertEmbed(range.index + 1, 'image', img_url)
            }
        })
    }
}
// quill init function
function quillInit() {
    let options = {
        modules: {
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
        document.getElementById("post-content").value = quill.root.innerHTML;
    })

}

// upload image func
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

            document.getElementById("post-thumbnail").value = img_url;
        }
    })
}

// 글 등록
function post_submit() {
    // 제목
    let title = $('#post-title').val();
    // 작성자
    let author = $('#post-author').val();
    // 썸네일 주소
    let thumbnail = $('#post-thumbnail').val();
    // 내용
    let content = $('#post-content').val();

    if (title === "") {
        alert("제목을 입력해주세요.")
        return;
    }
    if (content === "") {
        alert("내용을 입력해주세요.")
        return;
    }

    $.ajax({
        type: "POST",
        url: "/api/post-write",
        data: { title: title, author: author, thumbnail: thumbnail, content: content },
        success: function (response) {
            window.location.href = "/"
        }
    })

}


$(document).ready(function () {
    quillInit();

    $("#post-image").on("change", upload_image);
})




