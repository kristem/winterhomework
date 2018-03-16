package com.blog.service;

import com.blog.dao.ArticleDao;
import com.blog.dao.UserDao;
import com.blog.token.Token;
import com.blog.util.LoginUtil;
import com.blog.util.SecretUtil;
import net.sf.json.JSONObject;


import javax.servlet.http.HttpServletRequest;

import java.util.Map;


import static com.blog.dao.UserDao.*;
import static com.blog.servlet.HasUserServlet.*;
import static com.blog.servlet.RefreshTokenServlet.JWT;


public class Receiver {
    private JSONObject requestJson;
    private JSONObject responseJson;
    private HttpServletRequest req;
    private String path;

    public Receiver() {
        this.requestJson = null;
        responseJson = new JSONObject();
    }

    public Receiver(String jsonStr, HttpServletRequest req) {
        this.requestJson = JSONObject.fromObject(jsonStr);
        this.req = req;
        responseJson = new JSONObject();
    }

    public Receiver(String jsonStr) {
        this.requestJson = JSONObject.fromObject(jsonStr);
        responseJson = new JSONObject();
    }

    public Receiver(String jsonStr, String path) {
        this.path = path;
        this.requestJson = JSONObject.fromObject(jsonStr);
        responseJson = new JSONObject();
    }

    public Receiver(HttpServletRequest req) {
        this.req = req;
        responseJson = new JSONObject();
    }

    public Receiver(HttpServletRequest req, String path) {
        this.req = req;
        this.path = path;
        responseJson = new JSONObject();
    }

    public String getResponse() {
        return responseJson.toString();
    }

    public static final String FORMAT_ERROR = "formatError";

    private void errorString() {
        responseJson.put(RESULT, FORMAT_ERROR);
    }

    public static final String AUTHOR = "author";
    public final static int TOKEN_OVERTIME_SECOND = 604800;
    public static final String SUCCESS = "success";
    public static final String PASSWORD_ERROR = "passwordError";
    public static final String REQUEST_ERROR = "requestError";
    public static final String CODE_ERROR = "codeError";
    public static final String CODE = "code";

    public void login() {
        if (SecretUtil.isSecret(requestJson)) {
            String username = requestJson.getString(USERNAME);
            String password = requestJson.getString(PASSWORD);
            System.out.println("用户名: " + username);
            String code = requestJson.getString(CODE);
            if (username != null && password != null && code != null) {
                if (!req.getSession().getAttribute("rand").toString().equals(code)) {
                    responseJson.put(RESULT, CODE_ERROR);
                } else if (LoginUtil.isPass(username, password)) {
                    Token token = new Token();
                    token.setSub(AUTHOR);
                    token.setTime(TOKEN_OVERTIME_SECOND);
                    token.setData(username);

                    responseJson.put(RESULT, SUCCESS);
                    responseJson.put(JWT, token.getToken());
                } else {
                    responseJson.put(RESULT, PASSWORD_ERROR);
                }
            } else {
                responseJson.put(RESULT, REQUEST_ERROR);
            }
        } else {
            errorString();
        }
    }

    public static final String TOKEN_OVERTIME = "tokenOvertime";
    public static final String TOKEN_ERROR = "tokenError";

    public void RefreshToken(String jwt) {
        if (SecretUtil.isSecret(requestJson)) {
            Token originToken = new Token(jwt);
            if (originToken.isToken()) {
                if (originToken.isNotTokenOverTime()) {
                    String username = originToken.getPlayloadMap().get("username");
                    Token newToken = new Token();
                    newToken.setSub(username);
                    newToken.setData(username);
                    newToken.setTime(TOKEN_OVERTIME_SECOND);
                    Map<String, String> dataMap = newToken.getPlayloadMap();
                    responseJson.put(USERNAME, username);
                    responseJson.put(LEVEL, dataMap.get(LEVEL));
                    responseJson.put(EMAIL, dataMap.get(EMAIL));
                    responseJson.put(RESULT, SUCCESS);
                    responseJson.put(JWT, newToken.getToken());
                } else {
                    responseJson.put(RESULT, TOKEN_OVERTIME);
                }
            } else {
                responseJson.put(RESULT, TOKEN_ERROR);
            }
        } else {
            errorString();
        }
    }

    public static void main(String[] args) {
        Token t = new Token("963beb3afb5d58b15e07860c6a44c2fa0baef085bf21f27e202a5f0bb02f9807.eydzdWInOidhdXRob3InLCdjb21tZW50TnVtYmVyJzonMCcsJ25iZic6JzE1MTk3MzQ1MDYnLCd1cE51bWJlcic6JzAnLCdsZXZlbCc6JzEnLCdpc3MnOidiaWxpYmlsaS5jb20nLCdleHAnOicxNTIwMzM5MzA2JywnaWF0JzonMTUxOTczNDUwNicsJ2VtYWlsJzonNDQ3MzE3OTA3QHFxLmNvbScsJ3VzZXJuYW1lJzonYWRtaW4nLCdiaWdWaXAnOicwJywnY29pbic6JzAnfQ==.1482f3788794d6d5fd556ed916710930b703f5437b04b554764ce993d9bdb0d3");
        System.out.println(t.isNotTokenOverTime());
    }

    public void Register() {
        if (SecretUtil.isSecret(requestJson)) {
            String username = requestJson.getString(USERNAME);
            String email = requestJson.getString(EMAIL);
            String password = requestJson.getString(PASSWORD);
            String code = requestJson.getString(CODE);
            if (!req.getSession().getAttribute("rand").equals(code)) {
                responseJson.put(RESULT, CODE_ERROR);
            } else if (!LoginUtil.hasUser(username)) {
                UserDao.insertNewUser(username, password, email);
                Token token = new Token();
                token.setSub(AUTHOR);
                token.setTime(TOKEN_OVERTIME_SECOND);
                token.setData(username);
                responseJson.put(RESULT, SUCCESS);
                responseJson.put(JWT, token.getToken());
            } else {
                responseJson.put(RESULT, USER_EXIST);
            }
        } else {
            errorString();
        }
    }



    /**
     * 上传文章.
     */
    public void upArticle() {
        if (SecretUtil.isSecret(requestJson)) {
            String title = requestJson.getString("title");
            String content = requestJson.getString("content");
            String summary = requestJson.getString("summary");
            String upUser = requestJson.getString("upUser");
            ArticleDao.upArticleInfo(title, content, summary, upUser);
            responseJson.put(RESULT, SUCCESS);
        }else {
            errorString();
        }
    }

    public void ArticleInfoUpdate() {
        if (SecretUtil.isSecret(requestJson)) {
            String title = requestJson.getString("title");
            String content = requestJson.getString("content");
            ArticleDao.updateArticleInfo(title,content);
            responseJson.put(RESULT, SUCCESS);
        } else {
            errorString();
        }
    }

    public void UserInfoUpdate() {
        if (SecretUtil.isSecret(requestJson)) {
            String email = requestJson.getString(EMAIL);
            UserDao.updateUserInfo(email);
            responseJson.put(RESULT, SUCCESS);
        } else {
            errorString();
        }
    }

}