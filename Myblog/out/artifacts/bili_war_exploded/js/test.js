ajax({
            data: {
                videoId: videoId
            },
            method: "GET",
            jwt: localStorage.jwt,
            async: true,
            url: "/manage/deleteVideo",
            success: function(msg) {
                console.log(msg);
                // window.location.href = './up_page.html';
            }
        });