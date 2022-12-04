let editor = new Quill('#editor', {
    modules: {
        toolbar: {
            container: [
                [{ 'font': [] }, { 'size': [] }],
                [{ 'header': 1 }, { 'header': 2 }],
                ['bold', 'underline', 'strike', 'blockquote', 'code-block'],
                [{ 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' },],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                ['link'],
            ],
        }
    },
    theme: 'snow',
});