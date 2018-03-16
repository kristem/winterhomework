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
                $(".p_name").innerText = userInfo.username;
                $(".p_level").innerText = 'Lv. ' + userInfo.level;
                $(".coin_num").innerText = userInfo.coin;
                ajax({
                    jwt: localStorage.jwt,
                    url: "/info/getExtraInfo",
                    data: {
                        username: JSON.parse(msg).username
                    },
                    method: "GET",
                    async: true,
                    success: function(msg_02) {
                        var json = JSON.parse(msg_02);
                        $("#sign_input").value = json.sign;
                        $("#email_input").value = json.email;
                    }
                })
            }
        },
        error: function(e) {
            window.location.href = '/html/sign.html';
        }
    });
}


/**
 * 清除所有提示信息
 */
function clearAll() {
    var boxs = $(".error_box", true);
    var len = boxs.length;
    for(var i = 0; i < len; i++) {
        boxs[i].innerText = "";
    }
    boxs = $(".ok_box", true);
    var len = boxs.length;
    for(var i = 0; i < len; i++) {
        boxs[i].innerText = "";
    }
}

/**
 * 打印信息
 * @param  {String} msg 打印的信息
 * @param  {Number} num 位置
 * @param  {Bool} sta   颜色
 */
function changeMsg(msg, num, sta) {
    if(sta) {
        var box = $(".ok" + num);
        box.innerText = msg;
    }
    else {
        var box = $(".e" + num);
        box.innerText = msg;
    }
}

/**
 * 检查输入数据
 * @param  {String} email 用户邮箱
 * @param  {String} sign  用户个性签名
 * @return {Bool}         是否合法
 */
function check(email, sign) {
    if(email === "") {
        changeMsg("邮箱不得为空!", 1, false);
        return false;
    }
    else if(email.length > 40) {
        changeMsg("邮箱长度超限!", 1, false);
        return false;
    }
    else if(!/^[\w\.]+@[\w\.]+\.\w+$/.test(email)) {
        changeMsg("邮箱格式错误!", 1, false);
        return false;
    }
    else if(sign.length > 80) {
        changeMsg("签名长度不得超过80字符!", 2, false);
        return false;
    }
    return true;
}

/**
 * 提交表单
 */
function doSubmit() {
    clearAll();
    var email = $("#email_input").value;
    var sign = $("#sign_input").value;
    if(check(email, sign)) {
        ajax({
            jwt: localStorage.jwt,
            url: "/info/updateBaseInfo",
            data: {
                email: email,
                sign: sign
            },
            method: "POST",
            async: true,
            success: function(msg) {
                var json = JSON.parse(msg);
                if(json.result === "success") {
                    changeMsg("保存成功!", 1, true);
                }
                else {
                    changeMsg("保存失败!", 3, false);
                }
            },
            error: function() {
                changeMsg("保存失败!", 3, false);
            }
        });
    }
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

    $("#info_sumbit").addEventListener("click", doSubmit, false);

    var email = $("#email_input");
    var sign = $("#sign_input");
    email.onblur = function () {
        clearAll();
    }
    sign.onblur = function () {
        clearAll();
    }

}, false);