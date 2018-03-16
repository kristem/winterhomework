package com.blog.dao;

import com.blog.Article.Article;
import com.blog.util.JdbcUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;


public class ArticleDao {

    public static Article getArticleInfo(int id) {
        String sql = "SELECT article.*,user.* FROM article,user WHERE article.id = ? AND article.authorId = user.id AND success = 'y'";
        Article article = null;
        try {
            Connection connection = JdbcUtil.getConnection();
            PreparedStatement pstmt = connection.prepareStatement(sql);
            pstmt.setInt(1, id);
            ResultSet resultSet = pstmt.executeQuery();
            if (resultSet.next()) {
                article = new Article(resultSet);
            }
            resultSet.close();
            pstmt.close();
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return article;
    }

    public static void upArticleInfo(String title,String content, String summary, String upUser){
        String sql = "insert into article(title,content,summary,upUser) value(?,?,?,?)";
        Connection connection=null;
        PreparedStatement preparedStatement=null;
        try {
            connection = JdbcUtil.getConnection();
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1,title);
            preparedStatement.setString(2,content);
            preparedStatement.setString(3,summary);
            preparedStatement.setString(4,upUser);
            preparedStatement.execute();
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("上传文章时错误！");
        }finally {
            JdbcUtil.close(connection,preparedStatement);
        }
    }

    public static void updateArticleInfo(String title,String content) {
        String sql = "UPDATE article SET title = ?, content = ?" +
                " WHERE id=?";
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {
            connection = JdbcUtil.getConnection();
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, title);
            preparedStatement.setString(2, content);
            preparedStatement.execute();

        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("更新文章信息时抛错误！");
        } finally {
            JdbcUtil.close(connection, preparedStatement);
        }
    }
    public static void stopArticle(String articleId) {
        String sql = "DELETE FROM article " +
                "WHERE id = ?";
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {

            connection = JdbcUtil.getConnection();
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, Integer.parseInt(articleId));
            preparedStatement.execute();

        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("删除文章时抛错误！");
        } finally {
            JdbcUtil.close(connection, preparedStatement);
        }
    }

    public static boolean deleteArticle(String articleId) {

        String sql_01 = "SELECT articlePath FROM article WHERE id = ?";
        String sql_02 = "DELETE articlePath FROM article WHERE id = ?";
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = JdbcUtil.getConnection();
            preparedStatement = connection.prepareStatement(sql_01);
            preparedStatement.setInt(1, Integer.parseInt(articleId));

            resultSet = preparedStatement.executeQuery();

            //删除数据库中的信息
            preparedStatement = connection.prepareStatement(sql_02);
            preparedStatement.setInt(1, Integer.parseInt(articleId));
            preparedStatement.execute();

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            JdbcUtil.close(connection, preparedStatement);
        }
        return true;
    }


}
