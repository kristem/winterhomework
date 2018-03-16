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
                    var bnts = $(".super_bnt a",true);
                    bnts[0].style.display = 'block';
                    bnts[0].href = './manage_root.html';
                }
                $(".face").src = userInfo.photoUrl;
                $("#cur_head").src = userInfo.photoUrl;
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
 * 提交头像
 */
function doSubmit() {
    clearAll();
    var file = $("#info_bnt").files[0];
    var maxSize = 1024 * 1024 * 2;
    var minSize = 1024 * 10;
    var type = file.type.slice(file.type.lastIndexOf('/') + 1);
    if (type !== "jpg" && type !== "jpeg" && type !== "png") {
        changeMsg("请上传'jpg','jpeg','png'格式文件!", 1, false);
        return false;
    }
    else if (file.size > maxSize) {
        changeMsg("请上传小于2MB的图片!", 1, false);
        return false;
    } else if (file.size < minSize) {
        changeMsg("请上传大于10KB的图片!", 1, false);
        return false;
    }

    var formFile = new FormData();
    formFile.append("file", file);
    var data = formFile;

    ajax({
        jwt: localStorage.jwt,
        url: "/info/upHeadImg",
        data: data,
        method: "POST",
        async: true,
        isFile: true,
        success: function(msg) {
            var json = JSON.parse(msg);
            if (json.result === "success") {
                changeMsg("上传成功!", 1, true);
                $("#cur_head").src = json.url;
            } else {
                changeMsg("上传失败!", 1, false);
            }
        },
        error: function() {
            changeMsg("上传失败!", 1, false);
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

    $("#info_bnt").addEventListener("change", doSubmit, false);
    $("#info_bnt").addEventListener("blur", clearAll, false);

}, false);