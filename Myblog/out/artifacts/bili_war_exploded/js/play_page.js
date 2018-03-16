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

function init() {
    var video =  $("#video");
    var t = setInterval(function() {

        if(video.ended) {
            clearInterval(t);
        }

        var sec_01 = Math.floor(video.currentTime % 60);
        var min_01 = Math.floor(video.currentTime / 60);
        if(sec_01 < 10) {
            sec_01 = "0" + sec_01.toString();
        }
        if(min_01 < 10) {
            min_01 = "0" + min_01.toString();
        }
        $(".cur").innerText = min_01 + ":" + sec_01;
        var sec_02 = Math.floor(video.duration % 60);
        var min_02 = Math.floor(video.duration / 60);
        if (sec_02 < 10) {
            sec_02 = "0" + sec_02.toString();
        } else if(min_02 < 10) {
            min_02 = "0" + min_02.toString();
        }
        $(".tot").innerText = min_02 + ":" + sec_02;

        var line = $(".blue_line");
        line.style.width = (video.currentTime/video.duration.toString())*100 +
        "%";
    } , 400);

    //为播放按钮绑定事件
    $(".pause").onclick = function () {
        var i_02 = $(".start");
        $("#video").play();
        $(".pause").style.display = 'none';
        i_02.style.display = 'block';
        $(".p_shodow").style.display = "none";
    }

    $(".start").onclick = function () {
        $("#video").pause();
        var i_02 = $(".pause");
        this.style.display = 'none';
        i_02.style.display = 'block';
        $(".p_shodow").style.display = "block";
    }

    $(".left_mid").onclick = function() {
        var video = $("#video");
        if(video.paused) {
            video.play();
            $(".pause").style.display = 'none';
            $(".start").style.display = 'block';
            $(".p_shodow").style.display = "none";
        }
        else {
            video.pause();
            $(".start").style.display = 'none';
            $(".pause").style.display = 'block';
            $(".p_shodow").style.display = "block";
        }
    }

    $("#Terminal").onclick = function () {
        if(this.className === 'Terminal_active') {
            $("#video").controls = '';
            this.className = 'Terminal_unactive';
        }
        else {
            $("#video").controls = 'controls';
            this.className = 'Terminal_active';
        }
    }

}

document.addEventListener("DOMContentLoaded", function(event) {
	//检测用户登入状态,并初始化顶部信息
    //发送检查jwt请求
    // isLogin();
    getCnt();

    var videoId = getRequest().videoId;
    //请求视频信息
    ajax({
        url: "/info/getVideoById",
        method: "GET",
        async: true,
        data: {
            videoId: videoId
        },
        success: function(msg) {
            var job = JSON.parse(msg);
            if(job.result === 'success') {
                $(".d_video_title").innerText = job.title;
                $(".father_div").innerText = job.fatherDiv.toUpperCase();
                $(".son_div").innerText = job.sonDiv.toUpperCase();
                $(".d_hits").innerText = job.hits;
                $(".d_barr").innerText = job.barrageNumber;
                $(".d_coin").innerText = "硬币 " + job.coinNum;
                $(".d_userName").innerText = job.upUser;
                $("time").innerText = job.videoDate.slice(0, job.videoDate - 2);
                $("#video").src = job.videoUrl + '/' + job.videoName;
                ajax({
                    jwt: localStorage.jwt,
                    url: "/info/getExtraInfo",
                    data: {
                        username: job.upUser
                    },
                    method: "GET",
                    async: true,
                    success: function(msg_02) {
                        var json = JSON.parse(msg_02);                
                        $(".u_sign").innerText = json.sign;
                        $(".d_user_head").src = json.photoUrl;
                    }
                })
                ajax({
                    jwt: localStorage.jwt,
                    url: "/manage/upHits",
                    data: {
                        videoId: job.id
                    },
                    method: "GET",
                    async: true,
                })
            }
            else {
                window.location.href = './error_page.html';
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
    	window.location.href = '/html/sign.html'
    }

    //为展开按钮绑定事件
    $("#up_bnt").onclick = function () {
        var box = $("#u_sign_box");
        if(this.className === "up_bnt_status") {
            this.className = "";
            box.className = "";
            this.innerText = "收起";
        }
        else {
            this.className = "up_bnt_status";
            box.className = "up_span_status";
            this.innerText = "展开";
        }
    }

    //为搜索按钮绑定事件
    $(".search_bnt").onclick = function() {
        var keyword = $(".search_word").value;
        window.location.href = '/html/search_page.html?word=' + escape(keyword);
    }

    init();

}, false);

