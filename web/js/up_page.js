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
                $(".p_name").innerText = userInfo.username;
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
 * 上传表单
 * @return {bool} [Check不通过则阻止上传]
 */
function doSubmit() {
    clearAll();
    var title = $("#article_title").value;
    var summary = $("#summary").value;
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
            articleId: articleId,
        },
        url: "/up/upArticle",
        method: "POST",
        anync: true,
        isJson: true,
        success: function(msg) {
            var res = JSON.parse(msg).result;
            if (res === "imgError") {
                printError('请上传标题!', 4);
            }
            else if (res === "signError") {
                window.location.href = './sign.html';
            }
            else if (res === "formatError") {
                printError('文章格式错误,五秒后返回上传页面', 3);
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
        localStorage.jwt = '';
        window.location.href = '/html/up_blog.html';
    }

    //为文本框失焦绑定事件
    $("#article_title").onblur = function() {
        clearAll();
    }
    $("#summary").onblur = function() {
        clearAll();
    }

}, false)