/**
 * 发送检查jwt请求.
 */
var isLogin = function () {
    if(!localStorage.jwt || localStorage.jwt.length === 0) {
        window.location.href = '/html/sign.html';
    }
    ajax({
        jwt: localStorage.jwt,
        url: "/sign/isLogin",
        method: "GET",
        async: true,
        success: function(msg) {
            var obj = JSON.parse(msg);
            if(obj.jwt){
                localStorage.jwt = obj.jwt;
                userInfo = JSON.parse(msg);
                $(".face").src = userInfo.photoUrl;
                $(".p_name").innerText = userInfo.username;
            }
        },
        error: function(e) {
            window.location.href = '/html/sign.html';
        }
    });
}

document.addEventListener("DOMContentLoaded", function(event) {
	//检测用户登入状态,并初始化顶部信息
    //发送检查jwt请求
    isLogin();
    var word = getRequest().word;

    //请求视频信息
    ajax({
        url: "/info/getArticleByKeyTitle",
        method: "GET",
        data: {
            title: word
        },
        async: true,
        success: function(msg) {
            var job = JSON.parse(msg);
            var len = job.list.length;
            if(len === 0) {
                $(".no_res_box").style.display = 'block';
                $(".res_box").innerText = "";
                return;
            }
            $(".wordspan").innerText = word;
            $(".numspan").innerText = len;
            for(var i = 0; i < len; i++) {
                boxMaker(job.list[i].min,
                    job.list[i].title,job.list[i].id,
                    job.list[i].upUser,job.list[i].upUserId);
            }
        }
    });
    
    //顶部用户栏绑定事件
    addSlidEvent($('.user_head'), $('.info_box'), true, 5 , 5, -15, 0);
    addSlidEvent($('.info_bnt'), $('.in_box'), true, 5 , 3, -15, 0);
    addSlidEvent($('.vip_bnt'), $('.vip_box'), true, 5 , 3, -15, 0);
    addSlidEvent($('.up_button'), $('.up_box'), true, 5 , 3, -15, 0);
    $("#quit_bnt").onclick = function () {
    	localStorage.jwt = '';
    	window.location.href = '/html/sign.html';
    }

    //为搜索按钮绑定事件
    $(".search_bnt").onclick = function() {
        var keyword = $(".search_word").value;
        window.location.href = '/html/search_page.html?word=' +  escape(keyword);
    }

}, false);

