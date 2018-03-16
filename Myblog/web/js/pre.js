/**
 * [封装Ajax]
 * @param  {Object} obj [含有Ajax信息的对象]
 * @param  {String} obj.url [URL路径]
 * @param  {String} obj.method [发送的方式]
 * @param  {Bool} obj.notAsync [是否同步]
 * @param  {Object} obj.data [含有发送信息的对象]
 * @param  {Function} obj.success [成功时的执行函数]
 * @param  {Function} obj.error [失败时的执行函数]
 * @param  {Bool} obj.isJson [发送的是否为Json]
 * @param  {String} obj.jwt [jwt字符串]
 * @param  {Bool} obj.isFile [是否为文件]
 */
function ajax(obj) {
    //初始化
    obj = obj || {};
    obj.isFile = obj.isFile || false;
    obj.method = obj.method || "POST";
    obj.url = obj.url || "";
    obj.data = obj.data || null;
    obj.success = obj.success || function() {};
    obj.isJson = obj.isJson || false;
    obj.jwt = obj.jwt || "";
    if (obj. async === undefined) {
        obj.async = true;
    }

    //创建
    var xhr = null;
    if (XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    var postData = null;

    if (obj.isJson) {
        postData = JSON.stringify(obj.data);
        obj.dataType = "json";
        obj.contentType = 'application/json; charset=utf-8';
    }
    else if(obj.isFile) {
        postData = obj.data;
    }
    else {
        var params = [];
        for (var key in obj.data) {
            params.push(key + '=' + obj.data[key]);
        }
        postData = params.join('&');
        obj.contentType = 'application/x-www-form-urlencoded;charset=UTF-8'
    }

    //发送
    if (obj.method.toUpperCase() === "POST") {
        xhr.open(obj.method, obj.url, obj.async);
        if(!obj.isFile) xhr.setRequestHeader('Content-Type', obj.contentType);
        if (obj.jwt !== "") {
            xhr.setRequestHeader("jwt", obj.jwt);
        }
        xhr.send(postData);
    } else if (obj.method.toUpperCase() === "GET") {
        xhr.open(obj.method, obj.url + '?' + postData, obj.async);
        if (obj.jwt !== "") {
            xhr.setRequestHeader("jwt", obj.jwt);
        }
        xhr.send(null);
    }

    //执行完成操作
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                if (obj.success) {
                    obj.success(xhr.responseText);
                }
            } else {
                if (obj.error) {
                    obj.error(xhr.status);
                }
            }
        }
    }
}

var userInfo = null;

/**
 * [选择器函数]
 * @param  {string} str [查询条件]
 * @param  {bool} all [全局搜索]
 * @return {object|array}     [返回对象或对象的数组]
 */
var $ = function (str,all) {
    if(arguments.length == 1 || !all) {
        return document.querySelector(str);
    }
    return document.querySelectorAll(str);
}

/**
 * 得到当前CSS样式值
 * @param  {Object} elem [操作元素]
 * @param  {String} name [样式名称]
 * @return {String}      [样式当前的值]
 */
var getStyle = function (elem, name) {
    if(elem.currentStyle) {
        return elem.currentStyle[name];
    }
    else {
        return getComputedStyle(elem, false)[name];
    }
}

/**
 * 显示元素
 * @param  {Object} elem  [操作元素]
 * @param  {String} elem  [Display样式]
 */
var show = function (elem, status) {
    status = status || 'block';
    var curDisplay = getStyle(elem, 'display');

    if (curDisplay == 'none') {
        elem.style.display = status;
    }
}

/**
 * 隐藏元素
 * @param  {Object} elem  [操作元素]
 */
var hide = function (elem) {
    elem.style.display = 'none';
}

/**
 * 设置元素的透明度
 * @param {Object} elem [操作元素]
 * @param {Number} level [透明度值]
 */
var setOpacity = function (elem, level){
    elem.style.opacity = level / 100;
}

/**
 * 元素淡入
 * @param  {Object} elem  [操作元素]
 * @param  {Number} speed [速度(毫秒)]
 */
var fadeIn = function (elem, speed) {
    if(fi_inter) {
        clearInterval(fi_inter);
    }
    setOpacity(elem, 0);
    var cur = 0;
    var fi_inter = setInterval(function() {
        setOpacity(elem, cur+=2);
        if(cur >= 100) {
            clearInterval(fi_inter);
        }
    }, speed);
}

/**
 * 元素偏移
 * @param  {Object} elem  [操作元素]
 * @param  {Number} x     [x轴偏移量(像素)]
 * @param  {Number} y     [y轴偏移量(像素)]
 * @param  {Number} speed [速度(毫秒)]
 */
var slideAway = function (elem, x, y, speed) {
    if (sl_inter) {
        clearInterval(si_inter);
    }
    var curTop, curLeft;
    var curPo = getStyle(elem, 'position');
    if (curPo === 'relative' || curPo === 'absolute') {
        curTop = parseInt(getStyle(elem, 'top')) || 0;
        curLeft = parseInt(getStyle(elem, 'left')) || 0;
    }
    else {
        elem.style.position = 'relative';
        curTop = 0;
        curLeft = 0;
    }
    var pX = x + curTop;
    var pY = y + curLeft;
    var cnt = 1;
    var sl_inter = setInterval(function() {
        if (x !== 0) elem.style.top = curTop + cnt/100*x + 'px';
        if (y !== 0) elem.style.left = curTop + cnt/100*y + 'px';
        if(cnt >= 100) {
            clearInterval(sl_inter);
            if (x !== 0) elem.style.top = pX + 'px';
            if (y !== 0) elem.style.left = pY + 'px';
        }
        cnt+=2;
    }, speed);
}

/**
 * 添加特定的滑动事件
 * @param {Object} elem_01 [滑入的元素]
 * @param {Object} elem_02 [变化的元素]
 * @param {Number} isSlide [是否上滑]
 * @param {Number} time_01 [淡入速度]
 * @param {Number} time_02 [滑入速度]
 * @param {Number} top [上滑的像素]
 * @param {Number} left [右移的像素]
 */
var addSlidEvent = function (elem_01, elem_02, isSlide, time_01, time_02, top, left){
    elem_01.addEventListener('mouseenter', function(e) {
        elem_02.removeAttribute('style');
        fadeIn(elem_02, time_01);
        if (isSlide){
            slideAway(elem_02, top, left, time_02);
        }
    }, false);
}

function boxMaker(hour,min,sec,title,id,url,date,upUser,coin,userId,num) {
    min = hour*60 + min;
    if(min < 10) min = "0" + min.toString();
    if(sec < 10) sec = "0" + sec.toString();
    num = num || "";

    //弄出一堆元素
    var li_01 = document.createElement("li");
    var div_01 = document.createElement("div");
    div_01.className = "video_box";
    var a_01 = document.createElement("a");
    a_01.href = "/html/play_page.html?videoId=" + id;
    var div_02 = document.createElement("div");
    div_02.className = "pics_box";
    var div_03 = document.createElement("div");
    div_03.className = "lazy_pic";
    var img = document.createElement("img");
    img.src = url;
    img.alt = title;
    img.className = "v_pic";

    var span_01 = document.createElement("span");
    span_01.innerText = min + ":" + sec;
    span_01.className = "v_time";

    var div_04 = document.createElement("div");
    div_04.className = "v_info_box";
    var div_05 = document.createElement("div");
    var a_02 = document.createElement("a");
    a_02.href = "/html/play_page.html?videoId=" + id;
    a_02.innerText = title;
    a_02.className = "v_link";

    var div_06 = document.createElement("div");
    div_06.className = "v_tags";
    var span_02 = document.createElement("span");
    span_02.className = "watcher";
    var span_03 = document.createElement("span");
    span_03.className = "up_data";
    var span_04 = document.createElement("span");
    span_04.className = "up_user";
    var span_05 = document.createElement("span");
    var span_06 = document.createElement("span");
    var a_03 = document.createElement("a");
    span_05.innerText = coin;
    span_06.innerText = date;
    a_03.innerText = upUser;
    a_03.href = "/html/user_page.html?userId=" + userId;
    var i_01 = document.createElement("i");
    var i_02 = document.createElement("i");
    var i_03 = document.createElement("i");
    i_01.className = "v_icons";
    i_02.className = "v_icons";
    i_03.className = "v_icons";

    div_03.appendChild(img);
    div_02.appendChild(div_03);
    div_02.appendChild(span_01);
    a_01.appendChild(div_02);

    div_05.appendChild(a_02);

    span_02.appendChild(i_01);
    span_02.appendChild(span_05);
    span_03.appendChild(i_02);
    span_03.appendChild(span_06);
    span_04.appendChild(i_03);
    span_04.appendChild(a_03);

    div_06.appendChild(span_02);
    div_06.appendChild(span_03);
    div_06.appendChild(span_04);

    div_04.appendChild(div_05);
    div_04.appendChild(div_06);

    div_01.appendChild(a_01);
    div_01.appendChild(div_04);

    li_01.appendChild(div_01);

    $(".video_list" + num).appendChild(li_01);
}

/**
 * 获取链接传来的参数
 * @return {Object} 含参数的对象
 */
function getRequest() {
    var url = location.search;
    var para = {};
    if(url.indexOf('?') !== -1) {
        var str = url.substr(1);
        strs = str.split('&');
        var len = strs.length;
        for(var i = 0; i < len; i++) {
            para[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
        }
        return para;
    }
    return false;
}