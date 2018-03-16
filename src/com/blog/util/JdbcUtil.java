package com.blog.util;

import java.sql.*;

public final class JdbcUtil {

    private static String url = "jdbc:mysql://localhost:3306/blog?user=root&password=root&useUnicode=true&characterEncoding=UTF8";
    private static String user = "root";
    private static String password = "root";

    private JdbcUtil() {
    }

    // 注册驱动
    static {
        try {
            Class.forName("com.mysql.jdbc.Driver");
        } catch (Exception e) {
            throw new ExceptionInInitializerError(e);
        }
    }

    //建立连接
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, user, password);
    }

    //释放资源
    public static void free(ResultSet rs, Statement st, Connection conn) {
        try {
            if (rs != null)
                rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (st != null)
                    st.close();
            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                try {
                    if (conn != null)
                        conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }
    public static void close(Connection connection, PreparedStatement pstmt){
        try {
            if(pstmt!=null){
                pstmt.close();
                if(connection!=null){
                    connection.close();
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("关闭连接出了问题！");
        }
    }

    public static void close(Connection connection, PreparedStatement pstmt, ResultSet resultSet){
        try {
            if(resultSet!=null){
                resultSet.close();
                if(pstmt!=null){
                    pstmt.close();
                    if(connection!=null){
                        connection.close();
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("关闭连接出了问题！");
        }
    }

}