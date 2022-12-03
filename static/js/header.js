const links = document.querySelectorAll('#header .header-wrap .link a');

links.forEach(
    (item) => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            const href = this.getAttribute('href');

            // 추가 작업 요망!
            switch (href) {
                case "/login.html":
                    $.ajax({
                        type: "GET",
                        url: "/login",
                        success: function (response) {
                            console.log(response)
                        }
                    })
            }
        })
    }
)