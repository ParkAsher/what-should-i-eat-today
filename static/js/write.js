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
                quill.insertEmbed(range.index, 'image', img_url)
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
                    [{ 'align': [] }],
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
        }
    })
}


$(document).ready(function () {
    quillInit();

    $("#post-image").on("change", upload_image);
})


