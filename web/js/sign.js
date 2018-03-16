/**
 * [封装Ajax]
 * @param  {Object} obj [含有Ajax信息的对象]
 * @param  {String} obj.url [URL路径]
 * @param  {String} obj.method [发送的方式]
 * @param  {String} obj.async [是否异步]
 * @param  {Object} obj.data [含有发送信息的对象]
 * @param  {Function} obj.success [成功时的执行函数]
 * @param  {Function} obj.error [失败时的执行函数]
 * @param  {Bool} obj.isJson [发送的是否为Json]
 * @param  {String} obj.jwt [jwt字符串]
 */
function ajax(obj) {
	//初始化
	obj = obj || {};
	obj.method = obj.method || "POST";
	obj.url = obj.url || "";
	obj.async = obj.async || true;
	obj.data = obj.data || null;
	obj.success = obj.success || function() {};
	obj.isJson = obj.isJson || false;
	obj.jwt = obj.jwt || "";

	//创建
	var xhr = null;
	if(XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	}
	else {
		xhr = new ActiveXObject('Microsoft.XMLHTTP');
	}

	var postData = null;

	if (obj.isJson) {
		postData = JSON.stringify(obj.data);
		obj.dataType = "json";
		obj.contentType = 'application/json; charset=utf-8';
	}
	else {
		var params = [];
		for(var key in obj.data) {
			params.push(key + '=' + obj.data[key]);
		}
		postData = params.join('&');
		obj.contentType = 'application/x-www-form-urlencoded;charset=utf-8'
	}

	//发送
	if(obj.method.toUpperCase() === "POST") {
		xhr.open(obj.method, obj.url, obj.async);
		xhr.setRequestHeader('Content-Type', obj.contentType);
		if(obj.jwt !== "") {
			xhr.setRequestHeader("jwt", obj.jwt);
		}
		xhr.send(postData);
	}
	else if(obj.method.toUpperCase() === "GET") {
		xhr.open(obj.method, obj.url + '?' + postData, obj.async);
		if(obj.jwt !== "") {
			xhr.setRequestHeader("jwt", obj.jwt);
		}
		xhr.send(null);
	}

	//执行完成操作
	xhr.onreadystatechange = function() {
		if(xhr.readyState === 4) {
			if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
				if(obj.success) {
					obj.success(xhr.responseText);
				}
			}
			else {
				if(obj.error) {
					obj.error(xhr.status);
				}
			}
		}
	}
}


/**
 * [选择器函数]
 * @param  {string} str [查询条件]
 * @param  {bool} all [全局搜索]
 * @return {object|array}     [返回对象或对象的数组]
 */
function $(str,all) {
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
function getStyle(elem, name) {
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
function show(elem, status) {
    status = status || 'block';
    var curDisplay = getStyle(elem, 'display');

    if (curDisplay == 'none') {
        elem.style.display = status;
    }
}

/**
 * 设置元素的透明度
 * @param {Object} elem [操作元素]
 * @param {Number} level [透明度值]
 */
function setOpacity (elem, level){
    elem.style.opacity = level / 100;
}

/**
 * 元素淡入
 * @param  {Object} elem  [操作元素]
 * @param  {Number} speed [速度(毫秒)]
 */
function fadeIn (elem, speed) {
    if(fi_inter) {
        clearInterval(fi_inter);
    }
    setOpacity(elem, 0);
    show(elem);
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
function slideAway (elem, x, y, speed) {
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

/**
 * [改变提示信息]
 * @param  {string} str [要打印的信息]
 * @param  {number} pos [信息位置, 1-用户名框, 2-密码框, 3-验证码框]
 * @param  {string} str [添加还是清除信息]
 */
function changeMag (str, pos, isAdd) {
	var box = null;
	var p = null;
	isAdd = isAdd || true;
	if(pos === 1) {
		box = $(".user_name_box input");
		p = $(".user_name_box .mas_p");
	}
	else if(pos === 2) {
		box = $(".pass_word_box input");
		p = $(".pass_word_box .mas_p");
	}
	else {
		box = $(".code_box input");
		p = $(".code_box .mas_p");
	}
	if(isAdd) {
		box.className = "error";
		p.innerText = str;
	}
	else {
		box.class = "normal";
		p.innerText = "";
	}
}

/**
 * [清除所有的提示信息]
 */
function clearAll() {
	$(".user_name_box input").className = "normal";
	$(".pass_word_box input").className = "normal";
	$(".code_box input").className = "normal";
	var ps = $(".mas_p",true);
	var len = ps.length;
	for(var i = 0; i<len; i++) {
		ps[i].innerText = "";
	}
}

/**
 * [检查用户名,密码,验证码是否规范]
 * @param  {object} Event [触发事件对象]
 */
function check (uName, uPsw, uCode) {
	clearAll();
	if(uName === "") {
		changeMag("用户名不得为空!", 1);
		return false;
	}
	else if(uPsw === "") {
		changeMag("密码不得为空!", 2);
		return false;
	}
	else if(uCode === "") {
		changeMag("验证码不得为空!", 3);
		return false;
	}
	else if(!/^\w{4}$/.test(uCode)){
		changeMag("验证码格式错误!", 3);
		return false;
	}
	return true;
}

/**
 * Ajax上传登陆信息.
 */
function doSubmit() {
	var uName = $("#username").value;
	var uPsw = $("#password").value;
	var uCode = $("#code").value;
	if(check(uName, uPsw, uCode)){
		ajax({
			data: {
	     	    username: uName,
       			password: uPsw,
       			code: uCode.toLowerCase()
			},
			url: "/sign/login",
			method: "POST",
			anync: true,
			isJson: true,
			success: function(msg){
				var jsonObj = JSON.parse(msg);
				if(jsonObj.result === 'success') {
					localStorage.jwt = jsonObj.jwt;
					window.location.href = '../index.html';
				}
				else if(jsonObj.result === 'codeError') {
					clearAll();
					changeMag('验证码错误!', 3);
					changeCode();
				}
				else if(jsonObj.result === 'passwordError'){
					clearAll();
					changeMag('用户名或密码错误!', 1);
				}
				else if(jsonObj.result === 'requestError'){
					clearAll();
					changeMag('请输入正确的格式!', 1);
				}
				else {
					clearAll();
					changeMag('未知错误!', 1);
				}
			},
			error: function() {
				clearAll();
				changeMag('服务器炸了! 请稍后再尝试.', 1);
			}
		});
	}
}

/**
 * 改变验证码
 */
function changeCode() {
	ajax({
		url: "/sign/getCode",
		method: "GET",
		anync: true,
		success: function(msg){
			$("#code_img").src = "data:image/jpeg;base64," + JSON.parse(msg).codeBase;
		}
	});
}

document.addEventListener("DOMContentLoaded", function(event){
    addSlidEvent($('.up_button'), $('.up_box'), true, 5 , 3, -15, 0);
	var bnt = $(".submit_bnt");
	var inputs = $(".input_box input",true);
	var len = inputs.length;
	for(var i = 0; i < len; i++) {
		inputs[i].addEventListener("blur", clearAll, false);
	}
	bnt.addEventListener("click", doSubmit, false);

	//验证码事件绑定
	changeCode();
	$(".code_block").onclick = function() {
		changeCode();
	}

} , false);
