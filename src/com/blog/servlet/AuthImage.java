package com.blog.servlet;

import com.blog.util.BASE64Encoder;
import com.blog.util.JsonUtil;
import com.blog.util.VerifyCodeUtil;
import net.sf.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.*;


@WebServlet("/sign/getCode")
public class AuthImage extends javax.servlet.http.HttpServlet implements javax.servlet.Servlet {
    static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setHeader("Pragma", "No-cache");
        resp.setHeader("Cache-Control", "no-cache");
        resp.setDateHeader("Expires", 0);
        resp.setContentType("image/jpeg");

        //生成图片
        int w = 100, h = 40;
        String realPath = this.getClass().getClassLoader().getResource("../../").getPath();
        String path = realPath + "img/code/";
        File codeImg = new File(path + "code.jpg");
        String verifyCode = VerifyCodeUtil.outputVerifyImage(w, h, codeImg, 4);

        //存入session
        HttpSession session = req.getSession(true);
        session.setAttribute("rand", verifyCode.toLowerCase());

        //转base64码
        JSONObject jsonObject = new JSONObject();
        InputStream in = null;
        byte[] data = null;
        try {
            in = new FileInputStream(path + "code.jpg");
            data = new byte[in.available()];
            in.read(data);
            in.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        BASE64Encoder encoder = new BASE64Encoder(resp.getOutputStream());
        jsonObject.put("codeBase", encoder.encode(data));
        JsonUtil.writeResponse(resp, jsonObject.toString());
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }
}
