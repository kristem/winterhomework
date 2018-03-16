package com.blog.servlet;

import com.blog.util.JsonUtil;
import com.blog.util.LoginUtil;
import net.sf.json.JSONObject;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static com.blog.dao.UserDao.USERNAME;
import static com.blog.dao.UserDao.UTF8;

/**
 *
     username:   用户名
 */

@WebServlet("/sign/isUserHas")
public class HasUserServlet extends HttpServlet {
    public static final String USER_EXIST = "userExist";
    public static final String CAN_REGISTER = "canRegister";
    public static final String RESULT = "result";
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding(UTF8);
        response.setCharacterEncoding(UTF8);
        String username = request.getParameter(USERNAME);
        JSONObject jsonObject = new JSONObject();
        if (LoginUtil.hasUser(username)) {
            jsonObject.put(RESULT, USER_EXIST);
        } else {
            jsonObject.put(RESULT, CAN_REGISTER);
        }
        JsonUtil.writeResponse(response, jsonObject.toString());
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        doGet(request, response);
    }

}
