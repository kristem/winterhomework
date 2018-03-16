package com.blog.admin;

import com.blog.dao.UserDao;

import java.sql.ResultSet;
import java.sql.SQLException;

public class User {
    private int id;
    private String userName;
    private String email;

    public User(){
    }
    public User(String name, String email){
        this.userName=name;
        this.email=email;
        this.id= UserDao.getUserId(name);
    }
    public User(ResultSet resultSet)throws SQLException{
        this.setUserName(resultSet.getString("userName"));
        this.setEmail(resultSet.getString("email"));
        this.setId(resultSet.getInt("id"));
    }
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {this.email=email;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

}

