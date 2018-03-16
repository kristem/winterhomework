/**
 * 检测用户是否登陆
 * @param  {Boolean} isSelf 查询用户是否为用户本身
 */
var isLogin = function(isSelf) {
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
                $(".face").src = userInfo.photoUrl;
                $(".p_name").innerText = userInfo.username;
                $(".p_level").innerText = 'Lv. ' + userInfo.level;
                $(".coin_num").innerText = userInfo.coin;
                if (isSelf) {
                    fillBlank(userInfo.id);
                }
            }
        },
        error: function(e) {
            window.location.href = '/html/sign.html';
        }
    });
}

/**
 * 检测用户是否存在, 并填充空白信息
 * @param  {Number} userId 用户id
 */
function fillBlank(userId) {
    ajax({
        url: "/info/getUserById",
        method: "GET",
        async: true,
        data: {
            userId: userId
        },
        success: function(msg) {
            var res = JSON.parse(msg);
            if (res.result === 'success') {
                console.log(res);
                $(".us_head_img").src = res.photoUrl;
                $(".us_user_name").innerText = res.username;
                $(".us_id").innerText = res.id;
                $(".us_time").innerText = "注册于 " + res.signInDate.slice(0, 10);
                $(".us_user_sign").innerText = res.userSign;
                if (res.bigVip) {
                    $(".us_big_vip").style.display = "inline-block"
                }
            } else {
                window.location.href = '/html/error_page.html';
            }
        },
        error: function(e) {
            window.location.href = '/html/error_page.html';
        }
    });

    ajax({
        url: "/info/getVideoByUserId",
        method: "GET",
        data: {
            userId: userId
        },
        async: true,
        success: function(msg) {
            var job = JSON.parse(msg);
            console.log(job);
            if(job.result === "error") {
                return;
            }
            var len = job.list.length;
            if(len === 0) {
                return;
            }
            hide($(".empty_box"));
            for(var i = 0; i < len; i++) {
                boxMaker(job.list[i].hour,job.list[i].min,job.list[i].sec,
                    job.list[i].title,job.list[i].id,job.list[i].coverUrl + "/cover_mini.jpg",
                    job.list[i].videoDate.slice(0,10),job.list[i].upUser,job.list[i].hits,job.list[i].upUserId);
            }
        },
    });

}

document.addEventListener("DOMContentLoaded", function(event) {

    // 检测用户登入状态,并初始化信息
    if (getRequest().userId) {
        $(".us_user_sign").href = "javascript:void(0);";
        var head_a = $(".change_head_href");
        head_a.parentNode.removeChild(head_a);
        fillBlank(getRequest().userId);
        isLogin(false);
    } else {
        isLogin(true);
    }

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