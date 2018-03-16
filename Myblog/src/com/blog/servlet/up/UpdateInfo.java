package com.blog.servlet.up;

import com.blog.command.Command;
import com.blog.command.UpdateArticleInfoCommand;
import com.blog.service.Receiver;
import com.blog.util.JsonUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static com.blog.dao.UserDao.UTF8;

@WebServlet("/up/upArticleInfo")
public class UpdateInfo extends HttpServlet{
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding(UTF8);
        req.setCharacterEncoding(UTF8);
        String jsonStr = JsonUtil.getJsonStr(req.getInputStream());

        Receiver receiver = new Receiver(jsonStr);
        Command command = new UpdateArticleInfoCommand(receiver);
        command.exectue();

        JsonUtil.writeResponse(resp, receiver.getResponse());
    }
}
