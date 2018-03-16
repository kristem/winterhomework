# INFO

## 用户接口

### /sign/register

简介: 用户注册.

请求格式: JSON
请求方法: POST

参数:

> username:   		用户名
> password:   		密码
> email:      		邮箱
> code:       		验证码(小写)

返回JSON:

> result: 		codeError		验证码错误
> ​			success			注册成功
> ​			userExist		用户名已存在



### /sign/isUserHas

简介: 检验用户是否存在.

请求格式: JSON
请求方法: GET

参数:

> username:   		用户名

返回JSON:

> result: 		userExist			用户已存在
> ​			canRegister			可以注册	





### /sign/login

简介: 用户登录.

请求格式: JSON
请求方法: POST

参数:

> username:   		用户名
> password:   		密码
> email:      		邮箱
> code:       		验证码(小写)

返回JSON:

> result: 		codeError			验证码错误
> ​			success				登录成功
> ​			passwordError		密码错误
> ​			resultError			输入错误



### /sign/getCode

简介: 获取BASE64传输的图片验证码.

请求格式: 无
请求方法: GET/POST

参数:

> 无

返回JSON:

> BASE64编码的图片流



### /up/upArticle

简介: 上传文章.

请求格式: json
请求方法: POST

参数:

> jwt

返回JSON:

> result(error): 		signError		标签错误
> result(success)		success			上传成功
> ​					articleId			文章ID



### /info/getUserById

简介: 通过ID搜索用户.

请求格式: 普通键值对
请求方法: GET

参数:

> userId:		用户ID

返回JSON:

> result: 		success    	搜索成功
> ​			error		搜索失败
> ​			用户信息



### /info/getExtraInfo

简介:获取其他信息.

请求格式: 普通键值对
请求方法:GET

参数:

> jwt
> username:	用户名

返回JSON:

> result: 	  signError：	标签错误	
> ​		  用户信息：
> ​					签名，注册日期，邮箱，是否管理员	



### /info/updateBaseInfo

简介:更改及基本信息(邮箱和签名).

请求格式: 普通键值对
请求方法: POST

参数:

> jwt
> email:		邮箱
> sign:		签名
> filename:	文件名

返回JSON:

> result: 	  signError：	标签错误	
> ​		  success：	更改成功




