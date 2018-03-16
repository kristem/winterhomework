package com.blog.servlet.manage;

import com.blog.dao.ArticleDao;
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

/**
 *  参数: jwt, videoId
 */

@WebServlet("/manage/deleteArticle")
public class DeleteArticle extends HttpServlet{
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String id = req.getParameter("articleId");
        String jwt = req.getHeader("jwt");
        String username = new Token(jwt).getPlayloadMap().get("username");
        JSONObject job = new JSONObject();
        if(SecretUtil.checkJwt(jwt) && SecretUtil.articleToUser(username, id)) {
            if(ArticleDao.deleteArticle(id)) {
                job.put("result", "success");
            }
            else {
                job.put("result", "error");
            }
        }
        JsonUtil.writeResponse(resp, job.toString());
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }
}
