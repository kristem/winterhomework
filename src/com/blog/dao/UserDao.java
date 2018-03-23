package com.blog.dao;

import com.blog.util.JdbcUtil;
import com.blog.util.SecretUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;


public class UserDao {
    public static final String USERNAME = "username";
    public static final String EMAIL = "email";
    public static final String LEVEL = "level";
    public static final String ID = "id";
    public static final String PASSWORD="password";
    public static final String UTF8 = "UTF-8";

    /**
     * 获得某个用户的信息
     *
     * @param username     用户名
     * @return 用户的信息Map
     */
    public static Map<String, String> getUserInfo(String username) {

        Map<String, String> info = null;
        String sql = "SELECT id,email FROM user WHERE username = ?";
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;

        try {

            connection = JdbcUtil.getConnection();
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, username);
            resultSet = preparedStatement.executeQuery();

            if (resultSet.next()) {
                info = new HashMap<>();
                info.put(USERNAME, username);
                info.put(ID, resultSet.getString(ID));
                info.put("email",resultSet.getString("email"));
            }

        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("getUserInfo抛错误！");
        } finally {
            JdbcUtil.close(connection, preparedStatement, resultSet);
        }

        return info;

    }

    /**
     * 获得某个用户的id
     *
     * @param username     用户名
     * @return 用户的id
     */
    public static int getUserId(String username) {

        int id = -1;
        String sql = "SELECT id FROM user WHERE username = ?";
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = JdbcUtil.getConnection();
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, username);
            resultSet = preparedStatement.executeQuery();

            if (resultSet.next()) {
                id = resultSet.getInt(ID);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("getUserId抛错误！");
        } finally {
            JdbcUtil.close(connection, preparedStatement, resultSet);
        }

        return id;

    }

    /**
     * 获得用户的密码
     *
     * @param username     用户名
     * @return 用户的已加密的密码
     */
    public static String getUserPass(String username) {

        String password = null;
        String sql = "SELECT password FROM user WHERE username = ?";
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;

        try {

            connection = JdbcUtil.getConnection();
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, username);
            resultSet = preparedStatement.executeQuery();

            if (resultSet.next()) {
                password = resultSet.getString(PASSWORD);
            }

        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("getUserPass抛错误！");
        } finally {
            JdbcUtil.close(connection, preparedStatement, resultSet);
        }

        return password;

    }

    /**
     * 新用户的注册
     *
     * @param username     用户名
     * @param password     密码
     * @param email        邮箱
     */
    public static void insertNewUser(String username, String password, String email) {

        String sql = "INSERT INTO user(username,password,email) VALUE(?,?,?)";
        Connection connection = null;
        PreparedStatement preparedStatement = null;

        System.out.println("新用户: 用户名 = " + username + ", 邮箱 = " + email);
        try {

            connection = JdbcUtil.getConnection();
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, username);
            preparedStatement.setString(2, SecretUtil.encoderHs256(password));
            preparedStatement.setString(3, email);
            preparedStatement.execute();

        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("insertNewUser抛错误！");
        } finally {
            JdbcUtil.close(connection, preparedStatement);
        }

    }
    public static void updateUserInfo(String email) {
        String sql = "UPDATE user SET emali = ? WHERE id=?";
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {
            connection = JdbcUtil.getConnection();
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, email);
            preparedStatement.execute();

        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("更新个人信息时抛错误！");
        } finally {
            JdbcUtil.close(connection, preparedStatement);
        }
    }

    public static void upHeadImg (String username, String url) {
        String sql = "UPDATE user SET photoUrl = ? WHERE username = ?";
        Connection connection = null;
        PreparedStatement preparedStatement = null;

        try {
            connection = JdbcUtil.getConnection();
            preparedStatement = connection.prepareStatement(sql);

            preparedStatement.setString(1, url);
            preparedStatement.setString(2, username);

            preparedStatement.execute();
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
        finally {
            JdbcUtil.close(connection, preparedStatement);
        }
    }
}

