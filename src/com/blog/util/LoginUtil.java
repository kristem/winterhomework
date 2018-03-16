package com.blog.util;


import com.blog.dao.UserDao;

public class LoginUtil {


    public static boolean isPass(String username, String password) {

        if (UserDao.getUserId(username) != -1) {
            String passwordSecret = UserDao.getUserPass(username);
            password = SecretUtil.encoderHs256(password);
            if (password.equals(passwordSecret)) {
                return true;
            }
        }
        return false;
    }

    public static boolean hasUser(String username) {
        return UserDao.getUserId(username) != -1;
    }
}


