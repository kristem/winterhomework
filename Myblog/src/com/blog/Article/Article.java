package com.blog.Article;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Article {
    private int id;
    private String title="";
    private String content="";
    private String summary="";
    private String upUser;

    public void setId(Integer id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Article(ResultSet resultSet)throws SQLException{
        this.setTitle(resultSet.getString("title"));
        this.setSummary(resultSet.getString("summary"));
        this.setId(resultSet.getInt("id"));
        this.setContent(resultSet.getString("content"));
    }
}
