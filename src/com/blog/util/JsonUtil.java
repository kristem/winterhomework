package com.blog.util;


import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

import static com.blog.dao.UserDao.UTF8;


public class JsonUtil {
    public static String getJsonStr(ServletInputStream input) throws IOException {
        BufferedReader reader = new BufferedReader(
                new InputStreamReader(
                        input,UTF8
                )
        );
        StringBuilder sb = new StringBuilder();
        String line = null;
        while((line=reader.readLine())!=null){
            sb.append(line);
        }
        return sb.toString();
    }

    public static boolean writeResponse(HttpServletResponse response,String json){
        BufferedWriter writer = null;
        boolean result=false;
        try {
            writer = new BufferedWriter(
                    new OutputStreamWriter(
                            response.getOutputStream(),UTF8
                    )
            );
            writer.write(json);
            writer.flush();
            result=true;
        } catch (IOException e) {
            e.printStackTrace();
            result=false;
        } finally {
            try {
                assert writer != null;
                writer.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return result;
    }
}