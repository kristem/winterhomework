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
                $(".p_level").innerText = 'Lv. ' + userInfo.level;
                $(".coin_num").innerText = userInfo.coin;
            }
        },
        error: function(e) {
            window.location.href = '/html/sign.html';
        }
    });
}

/**
 * [清除所有的提示信息]
 */
function clearAll() {
    var es = $(".error_box", true);
    for (var i = 0; i < es.length; i++) {
        es[i].innerText = '';
    }
}

/**
 * 在指定位置出打印出错误信息
 * @param  {String} msg 信息
 * @param  {Number} pos 信息出现的位置
 */
function printError(msg, pos) {
    var e = $(".e" + pos);
    e.innerText = msg;
}

/**
 * 检测输入和合法性
 * @param  {String} title    标题
 * @param  {String} summary  简介
 * @return {Boolean}         是否合法
 */
function check(title, summary) {
    var radios = $("[name=div]", true);
    var flag = false;
    var len = radios.length;
    for (var i = 0; i < len; i++) {
        if (radios[i].checked) {
            flag = true;
            break;
        }
    }

    if (!flag) {
        printError("请选择分区!", 1);
        return false;
    }
    if (title === "") {
        printError("稿件名不得为空!", 2);
        return false;
    } else if (!/^([\u4e00-\u9fa5]|[\w\s-!?·])+$/.test(title)) {
        printError("稿件名由汉字,字母,数字,'-','!','?','_' 组成!", 2);
        return false;
    } else if (summary === "") {
        printError("简介不得为空!", 3);
        return false;
    }
    return true;

}

/**
 * 上传表单
 * @return {bool} [Check不通过则阻止上传]
 */
function doSubmit() {
    clearAll();
    var title = $("#video_title").value;
    var summary = $("#summary").value;
    var div = null;
    if (!check(title, summary)) {
        return false;
    }

    var radios = $("[name=div]", true);
    var len = radios.length;
    for (var i = 0; i < len; i++) {
        if (radios[i].checked) {
            div = radios[i].value;
            break;
        }
    }

    ajax({
        data: {
            title: title,
            summary: summary,
            div: div,
            videoId: videoId,
            filename: filename,
            videoUrl: videoUrl
        },
        url: "/up/upVideoInfo",
        method: "POST",
        anync: true,
        isJson: true,
        success: function(msg) {
            var res = JSON.parse(msg).result;
            if (res === "imgError") {
                printError('请上传封面!', 4);
            } 
            else if (res === "signError") {
                window.location.href = './sign.html';
            }
            else if (res === "formatError") {
                printError('视频格式错误,五秒后返回上传页面', 3);
                setTimeout(function() {
                    window.location.href = './up_page.html';
                } , 5000)
            }
            else {
                upFlag = true;
                window.location.href = './ok_page.html';
            }
        },
        error: function() {
            clearAll();
            printError('服务器炸了! 请稍后再尝试.', 3);
        }
    });
}

/**
 * 将秒数转化成 '--:--:--' 的格式
 * @param  {Number} sec [秒数]
 * @return {String}     [格式化后的时间]
 */
function parseSec(sec) {
    var min = Math.floor(sec / 60) % 60;
    var hour = Math.floor(sec / 3600);
    sec = sec % 60;
    if (sec < 10) {
        sec = "0" + sec;
    }
    if (min < 10) {
        min = "0" + min;
    }
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (hour > 99) {
        return false;
    } else {
        return hour + ":" + min + ":" + sec;
    }
}

var videoId = null;
var videoUrl = null;
var filename = null;
var upFlag = false;

document.addEventListener("DOMContentLoaded", function(event) {

    //检测用户登入状态,并初始化顶部信息

    //发送检查jwt请求.
    isLogin();

    //初始动画与用户信息
    addSlidEvent($('.user_head'), $('.info_box'), true, 5, 5, -15, 0);
    addSlidEvent($('.info_bnt'), $('.in_box'), true, 5, 3, -15, 0);
    addSlidEvent($('.vip_bnt'), $('.vip_box'), true, 5, 3, -15, 0);
    addSlidEvent($('.up_button'), $('.up_box'), true, 5, 3, -15, 0);
    var box = $('.note_box', true);
    var fatherBox = $('.listof_notes>div', true);
    var len = box.length;
    for(var i = 0; i < len; i++) {
        if(i === 0) {
            addSlidEvent($('.status_box'), box[i], false, 5);
        }
        else {
            addSlidEvent(fatherBox[i-1], box[i], false, 5);
        }
    }

    //绑定退出按钮
    $("#quit_bnt").onclick = function() {
        localStorage.jwt = '';
        window.location.href = '/html/sign.html';
    }

    //为上传按钮绑定功能
    $("#file_input").onchange = function() {
        var file = this.files[0];
        filename = file.name;
        var maxSize = 1024 * 1024 * 400;
        if (file.size > maxSize) {
            printError("请上传小于400MB的视频!", 5);
            return false;
        }
        var type = file.name.slice(file.name.lastIndexOf('\.') + 1);
        if (type !== "mkv" && type !== "avi" && type !== "rmvb" &&
            type !== "rm" && type !== "mp4" && type !== "flv" &&
            type !== "wmv" && type !== "mov" && type !== "webm" &&
            type !== "mpeg4" && type !== "ts" && type !== "mpg") {
            printError("视频格式错误!", 5);
            return false;
        }

        (function() {
            var t = null;
            lastSize = 0;
            progress = 0;

            var formFile = new FormData();
            formFile.append("file", file);
            var data = formFile;
            t = setInterval(function() {
                ajax({
                    data: {
                        filename: file.name
                    },
                    method: "GET",
                    jwt: localStorage.jwt,
                    async: true,
                    url: "/up/getProgress",
                    success: function(msg) {
                        var job = JSON.parse(msg);
                        var speed = (job.progress - lastSize);
                        var res = (job.size - job.progress) / speed;

                        speed /= 1024;

                        if (speed <= 1024) {
                            speed = Math.floor(speed) + " KB/s";
                        } else {
                            speed = Math.floor(speed / 100) / 10 + " MB/s";
                        }

                        var percent = Math.floor((job.progress / job.size) * 100);
                        if (parseSec(res)) {
                            $(".vstatus_percent_note").innerText = percent + "%, " + speed + ", " + parseSec(Math.ceil(res));
                        } else {
                            $(".vstatus_percent_note").innerText = percent + "%, " + speed + ", --:--:--";
                        }
                        $(".progress_bar").style.width = percent + "%";
                        //17%, 6.6 MB/s, 00:02:15
                        lastSize = job.progress;
                    }
                });
            }, 1000);
            ajax({
                data: data,
                jwt: localStorage.jwt,
                method: "POST",
                async: true,
                url: "/up/upVideo",
                isFile: true,
                success: function(msg) {
                    clearInterval(t);
                    var job = JSON.parse(msg);
                    videoId = job.id;
                    videoUrl = job.url;
                    $(".vstatus_percent_note").style.display = "none";
                    $(".progress_bar").style.width = "100%";
                    $(".vstatus_ok_note").style.display = "inline-block";
                    var bnt = $("#v_submit_bnt");
                    bnt.className = "is_agree";
                    bnt.addEventListener("click", doSubmit, false);
                },
                error: function() {
                    $(".vstatus_error_note").style.display = "inline-block";
                }
            });
        })();
        $(".vstatus_vname").innerText = file.name;
        $("#video_title").value = file.name.slice(0, file.name.lastIndexOf('.'));
        $(".upload_box").style.display = 'block';
        $("#intro_page").style.display = 'none';
    };

    //绑定字数限制提示
    $("#video_title").oninput = function() {
        $(".title_word").innerText = this.value.length + '/80';
    };
    $("#summary").oninput = function() {
        $(".summary_word").innerText = this.value.length + '/1000';
    };

    //为撤销按钮绑定事件
    $("#v_cancel_bnt").onclick = function() {
        ajax({
            data: {
                filename: filename
            },
            method: "GET",
            jwt: localStorage.jwt,
            async: true,
            url: "/up/stopUp",
            success: function(msg) {
                videoId = videoId || JSON.parse(msg).id;
                ajax({
                    data: {
                        videoId: videoId
                    },
                    method: "GET",
                    jwt: localStorage.jwt,
                    async: true,
                    url: "/manage/deleteVideo",
                    success: function(msg) {
                        window.location.href = './up_page.html';
                    }
                });
            }
        });
    }
    window.onbeforeunload = function() {
        if (!upFlag) {
            ajax({
                data: {
                    filename: filename
                },
                method: "GET",
                jwt: localStorage.jwt,
                async: true,
                url: "/up/stopUp",
                success: function(msg) {
                    videoId = videoId || JSON.parse(msg).id;
                    ajax({
                        data: {
                            videoId: videoId
                        },
                        method: "GET",
                        jwt: localStorage.jwt,
                        async: true,
                        url: "/manage/deleteVideo",
                        success: function(msg) {
                            window.location.href = './up_page.html';
                        }
                    });
                }
            });
        }
    }

    //为图片上传按钮绑定事件
    $("#img_inputer").onchange = function() {
        var file = this.files[0];
        var maxSize = 1024 * 1024 * 5;
        var minSize = 1024 * 30;
        var type = file.type.slice(file.type.lastIndexOf('/') + 1);
        if (type !== "jpg" && type !== "jpeg" && type !== "png") {
            printError("请上传'jpg','jpeg','png'格式文件!", 4);
            return false;
        } else if (file.size > maxSize) {
            printError("请上传小于5MB的图片!", 4);
            return false;
        } else if (file.size < minSize) {
            printError("请上传大于30KB的图片!", 4);
            return false;
        }
        (function() {
            var formFile = new FormData();
            formFile.append("filename", filename);
            formFile.append("file", file);
            var data = formFile;

            ajax({
                data: data,
                jwt: localStorage.jwt,
                method: "POST",
                async: true,
                url: "/up/upCover",
                isFile: true,
                success: function(msg) {
                    $(".up_img_box").style.backgroundImage = 'url(' + JSON.parse(msg).url + "?t=" + Math.random() + ')';
                },
                error: function() {
                    printError("服务器错误!", 4);
                }
            });
        })();
    }

    //为文本框失焦绑定事件
    $("#video_title").onblur = function() {
        clearAll();
    }
    $("#summary").onblur = function() {
        clearAll();
    }
    $("#img_inputer").onclick = function() {
        clearAll();
    }

}, false);