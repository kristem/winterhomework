/**
 * 发送检查jwt请求.
 */
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
                 $(".face").src = userInfo.photoUrl;
                $(".p_name").innerText = userInfo.username;
                // $(".p_level").innerText = 'Lv. ' + userInfo.level;
                // $(".coin_num").innerText = userInfo.coin;
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

var indexM = 0;
var dots = null;
var pic = null;
var autoChange = null;
var titles = null;

//绑定轮播事件
function img_event() {
    autoChange = setInterval(function() {
        movePic_R();
    }, 5000);
    for (let i = 0; i <= dots.length - 1; i++) {
        setEvent(dots[i]);
        dots[i].onclick = function(){
             dotCilck(i);
        };
    }
    setEvent(pic);
}

//为元素绑定事件的方法.
function setEvent(theElement) {
    theElement.onmouseover = function() {
        clearInterval(autoChange);
    }
    theElement.onmouseout = function() {
        autoChange = setInterval(function() {
            movePic_R();
        }, 5000);
    }
}

//点击切换点时的动作.
function dotCilck(pos) {
    indexM = pos * 100;
    pic.style.marginLeft = "-" + indexM + "%";
    changeDot();
}

//向左偏移,左箭头的执行动作.
function movePic_R() {
    if (indexM >= 400) {
        indexM = 0;
    } else {
        indexM += 100;
    }
    pic.style.marginLeft = "-" + indexM + "%";
    changeDot();
}

//向右偏移,计时器与右箭头的执行动作.
function movePic_L() {
    if (indexM <= 0) {
        indexM = 400;
    } else {
        indexM -= 100;
    }
    pic.style.marginLeft = "-" + indexM + "%";
    changeDot();
}

//改变切换点的颜色.
function changeDot() {
    for (var i = 0; i < 5; i++) {
        titles[i].style.display = "none";
        dots[i].id = '';
    }
    dots[indexM / 100].id = 'active_bnt';
    titles[indexM / 100].style.display = "inline-block";
}

document.addEventListener("DOMContentLoaded", function(event) {
    //检测用户登入状态,并初始化顶部信息
    //发送检查jwt请求
    isLogin();
    getCnt();

    //请求视频信息
    ajax({
        url: "/info/videoByTime",
        method: "GET",
        async: true,
        success: function(msg) {
            var job = JSON.parse(msg);
            var len = job.length;
            for (var i = 0; i < len; i++) {
                boxMaker(job[i].hour, job[i].min, job[i].sec,
                    job[i].title, job[i].id, job[i].coverUrl + "/cover_mini.jpg",
                    job[i].videoDate.slice(0, 10), job[i].upUser, job[i].hits, job[i].upUserId);
            }
        }
    });

    //顶部用户栏绑定事件
    addSlidEvent($('.user_head'), $('.info_box'), true, 5, 5, -15, 0);
    addSlidEvent($('.info_bnt'), $('.in_box'), true, 5, 3, -15, 0);
    addSlidEvent($('.vip_bnt'), $('.vip_box'), true, 5, 3, -15, 0);
    addSlidEvent($('.up_button'), $('.up_box'), true, 5, 3, -15, 0);
    $("#quit_bnt").onclick = function() {
        localStorage.jwt = '';
        window.location.href = '/html/sign.html'
    }

    //为搜索按钮绑定事件
    $(".search_bnt").onclick = function() {
        var keyword = $(".search_word").value;
        window.location.href = '/html/search_page.html?word=' + escape(keyword);
    }

    dots = $(".dot",true);
    pic = $(".img_pic");
    titles = $(".img_title a", true);

    //为轮播框绑定事件
    img_event();

}, false);