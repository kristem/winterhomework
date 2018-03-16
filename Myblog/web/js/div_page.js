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
                $(".p_level").innerText = 'Lv. ' + userInfo.level;
                $(".coin_num").innerText = userInfo.coin;
            }
        },
        error: function(e) {
            window.location.href = '/html/sign.html';
        }
    });
}

function getCnt() {
    ajax({
        jwt: localStorage.jwt,
        url: "/info/getDivCnt",
        method: "GET",
        async: true,
        success: function(msg) {
            var obj = JSON.parse(msg);
            console.log(obj);
            $(".music_cnt").innerText = obj.music || '0';
            $(".movie_cnt").innerText = obj.movie || '0';
            $(".game_cnt").innerText = obj.game || '0';
            $(".tech_cnt").innerText = obj.tech || '0';
        },
    });
}

document.addEventListener("DOMContentLoaded", function(event) {
	//检测用户登入状态,并初始化顶部信息
    //发送检查jwt请求
    isLogin();
    getCnt();

    var divt1 = $(".div1_titlt");
    var divt2 = $(".div2_titlt");

    var div = getRequest().div;
    console.log(div)
    var sonDiv_01 = null;
    var sonDiv_02 = null;
    var realName_01 = null;
    var realName_02 = null;
    if(div === "music") {
        sonDiv_01 = "live";
        sonDiv_02 = "mv";
        realName_01 = "现场";
        realName_02 = "MV";
    } else if(div === "movie") {
        sonDiv_01 = "film";
        sonDiv_02 = "tv";
        realName_01 = "电影";
        realName_02 = "剧集";
    } else if(div === "game") {
        sonDiv_01 = "standalone";
        sonDiv_02 = "online";
        realName_01 = "单机";
        realName_02 = "网游";
    } else if(div === "tech") {
        sonDiv_01 = "publicclass";
        sonDiv_02 = "other";
        realName_01 = "公开课";
        realName_02 = "其他";
    } else {
        window.location.href = './error_page.html';
    }

    $(".div1_name").innerText = realName_01;
    $(".div2_name").innerText = realName_02;

    //请求分区信息
    ajax({
        url: "/info/getVideoByDiv",
        method: "GET",
        data: {
            div1: sonDiv_01,
            div2: sonDiv_02
        },
        async: true,
        success: function(msg) {
            var job = JSON.parse(msg);
            if(job.result === 'error') {
                window.location.href = './error_page.html';
            }
            var i;
            var len_01 = job.div1.length;
            var len_02 = job.div2.length;
            for(i = 0; i < len_01; i++) {
                boxMaker(job.div1[i].hour,job.div1[i].min,job.div1[i].sec,
                    job.div1[i].title,job.div1[i].id,job.div1[i].coverUrl + "/cover_mini.jpg",
                    job.div1[i].videoDate.slice(0,10),job.div1[i].upUser,job.div1[i].hits,job.div1[i].upUserId,"1");
            }
            for(i = 0; i < len_02; i++) {
                boxMaker(job.div2[i].hour,job.div2[i].min,job.div2[i].sec,
                    job.div2[i].title,job.div2[i].id,job.div2[i].coverUrl + "/cover_mini.jpg",
                    job.div2[i].videoDate.slice(0,10),job.div2[i].upUser,job.div2[i].hits,job.div2[i].upUserId,"2");
            }
        },
        error: function(msg) {
            window.location.href = './error_page.html';
        }
    });
    
    //顶部用户栏绑定事件
    addSlidEvent($('.user_head'), $('.info_box'), true, 5 , 5, -15, 0);
    addSlidEvent($('.info_bnt'), $('.in_box'), true, 5 , 3, -15, 0);
    addSlidEvent($('.vip_bnt'), $('.vip_box'), true, 5 , 3, -15, 0);
    addSlidEvent($('.up_button'), $('.up_box'), true, 5 , 3, -15, 0);
    $("#quit_bnt").onclick = function () {
    	localStorage.jwt = '';
    	window.location.href = '/html/sign.html'
    }

    //为搜索按钮绑定事件
    $(".search_bnt").onclick =  function() {
        var keyword = $(".search_word").value;
        window.location.href = '/html/search_page.html?word=' +  escape(keyword);
    }

}, false);

