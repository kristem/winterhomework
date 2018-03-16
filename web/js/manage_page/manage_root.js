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
                if (userInfo.isAdmin === "0") {
                    window.location.href = '../error_page.html';
                }
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
 * 清除所有提示信息
 */
function clearAll() {
    var boxs = $(".error_box", true);
    var len = boxs.length;
    for (var i = 0; i < len; i++) {
        boxs[i].innerText = "";
    }
    boxs = $(".ok_box", true);
    var len = boxs.length;
    for (var i = 0; i < len; i++) {
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
    if (sta) {
        var box = $(".ok" + num);
        box.innerText = msg;
    } else {
        var box = $(".e" + num);
        box.innerText = msg;
    }
}

/**
 * 检查输入数据
 * @param  {String} sql  sql语句
 * @return {Bool}         是否合法
 */
function check(sql) {
    if (sql === "") {
        changeMsg("语句不得为空!", 1, false);
        return false;
    }
    return true;
}

/**
 * 提交表单
 */
function doSubmit() {
    clearAll();
    var sql = $("#sql_input").value;
    if (check(sql)) {
        ajax({
            url: "/manage/putSQL",
            method: "POST",
            async: true,
            jwt: localStorage.jwt,
            data: {
                sql: sql
            },
            success: function(msg) {
                var json = JSON.parse(msg);
                if (json.result === "success") {
                    changeMsg("上传成功!", 1, true);
                } else {
                    changeMsg("上传失败!", 2, false);
                }
            },
            error: function() {
                changeMsg("上传失败!", 2, false);
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

    var sql = $("#sql_input");
    sql.onblur = function() {
        clearAll();
    }

}, false);