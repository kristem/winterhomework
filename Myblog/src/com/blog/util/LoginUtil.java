package com.blog.util;


import com.blog.dao.UserDao;

public class LoginUtil {


    public static boolean isPass(String username, String password) {

        if (UserDao.getUserid(username) != -1) {
            String passwordSecret = UserDao.getUserPass(username);
            password = SecretUtil.encoderHs256(password);
            if (password.equals(passwordSecret)) {
                return true;
            }
        }
        return false;
    }

    public static boolean isNumeric(String s) {
        return s != null && !"".equals(s.trim()) && s.matches("^[0-9]*$");
    }

    public static boolean hasSomeCharacter(String username) {
        return false;
    }

    public static boolean hasUser(String username) {
        return UserDao.getUserid(username) != -1;
    }
}


