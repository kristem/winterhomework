package com.blog.servlet.up;

import com.blog.command.UpHeadCommand;
import com.blog.service.Receiver;
import com.blog.token.Token;
import com.blog.util.JsonUtil;
import com.blog.util.SecretUtil;
import net.sf.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static com.blog.dao.UserDao.UTF8;


@WebServlet("/info/upHeadImg")
public class UpHeadImg extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding(UTF8);
        req.setCharacterEncoding(UTF8);
        String path = this.getClass().getClassLoader().getResource("../../").getPath();
        String jwt = req.getHeader("jwt");
        Token token = new Token(jwt);
        if(!SecretUtil.checkJwt(jwt)){
            JSONObject job = new JSONObject();
            job.put("result", "signError");
            JsonUtil.writeResponse(resp, job.toString());
            return;
        }
        Receiver receiver = new Receiver(req, path);
        UpHeadCommand command = new UpHeadCommand(receiver);
        command.setId(token.getPlayloadMap().get("id"));
        command.setUsername(token.getPlayloadMap().get("username"));
        command.exectue();
        JsonUtil.writeResponse(resp, receiver.getResponse());
    }
}
