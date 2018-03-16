function boxMaker_02(name, date, id, num) {
    var a_01 = document.createElement("a");
    a_01.className = "video_name";
    a_01.innerText = name;
    a_01.href = "../play_page.html?videoId=" + id;
    var a_02 = document.createElement("a");
    a_02.innerText = date;
    a_02.href = "javascript:void(0);"
    var div_01 = document.createElement("div");
    div_01.className = "leftInfo";

    var div_02 = document.createElement("div");
    div_02.className = "delete_con"
    div_02.id = id;
    div_02.onclick = function() {
        ajax({
            data: {
                videoId: id
            },
            method: "GET",
            jwt: localStorage.jwt,
            async: true,
            url: "/manage/deleteVideo",
            success: function(msg) {
                var thisNode = $("#li" + div_02.id);
                thisNode.parentNode.removeChild(thisNode);
            }
        });
    }
    var span_01 = document.createElement("span");
    span_01.className = "delete_bnt";
    span_01.innerText = "删除";

    var div_03 = document.createElement("div");
    div_03.className = "video_box";
    var li = document.createElement("li");
    li.id = "li" + id;

    div_01.appendChild(a_01);
    div_01.appendChild(a_02);
    div_02.appendChild(span_01);
    div_03.appendChild(div_01);
    div_03.appendChild(div_02);
    li.appendChild(div_03);

    $(".video_list").appendChild(li);

}

var isLogin = function() {
    if (!localStorage.jwt || localStorage.jwt.length === 0) {
        window.location.href = '/html/sign.html';
    }
    ajax({
        jwt: localStorage.jwt,
        url: "/sign/isLogin",
        method: "GET",
        async: true,
        success: function(msg) {
            var obj = JSON.parse(msg);
            if (obj.jwt) {
                localStorage.jwt = obj.jwt;
                userInfo = JSON.parse(msg);
                if (userInfo.isAdmin === "1") {
                    var bnts = $(".super_bnt a", true);
                    bnts[0].style.display = 'block';
                    bnts[0].href = './manage_root.html';
                }
                $(".face").src = userInfo.photoUrl;
                $(".p_name").innerText = userInfo.username;
                $(".p_level").innerText = 'Lv. ' + userInfo.level;
                $(".coin_num").innerText = userInfo.coin;
                ajax({
                    url: "/info/getVideoByUserId",
                    method: "GET",
                    data: {
                        userId: userInfo.id
                    },
                    async: true,
                    success: function(msg) {
                        var job = JSON.parse(msg);
                        if (job.result === "error") {
                            return;
                        }
                        var len = job.list.length;
                        if (len === 0) {
                            return;
                        }
                        hide($(".empty_box"));
                        for (var i = 0; i < len; i++) {
                            boxMaker_02(job.list[i].title, job.list[i].videoDate.slice(0, 10), job.list[i].id);
                        }
                    }
                });
            }
        },
        error: function(e) {
            window.location.href = '/html/sign.html';
        }
    });
}

document.addEventListener("DOMContentLoaded", function(event) {

    //检测用户登入状态,并初始化顶部信息

    //发送检查jwt请求.
    isLogin();

    //初始动画与用户信息
    addSlidEvent($('.user_head'), $('.info_box'), true, 5, 5, -15, 0);
    addSlidEvent($('.info_bnt'), $('.in_box'), true, 5, 3, -15, 0);
    addSlidEvent($('.vip_bnt'), $('.vip_box'), true, 5, 3, -15, 0);
    addSlidEvent($('.up_button'), $('.up_box'), true, 5, 3, -15, 0);

    //绑定退出按钮
    $("#quit_bnt").onclick = function() {
        localStorage.jwt = '';
        window.location.href = '/html/sign.html';
    }

}, false);