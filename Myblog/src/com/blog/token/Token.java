package com.blog.token;

import com.blog.dao.UserDao;
import com.blog.util.SecretUtil;
import net.sf.json.JSONObject;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.*;

/*
{
  'typ': 'JWT',
  'alg': 'HS256'
}
sub: 该JWT所面向的用户
iss: 该JWT的签发者
iat(issued at): 在什么时候签发的token
exp(expires): token什么时候过期
nbf(not before)：token在此时间之前不能被接收处理
jti：JWT ID为web token提供唯一标识
*/

public class Token {
    private String header;
    private Map<String, String> playloadMap;
    private String playloadStr;
    private String signature;

    public Token() {
        playloadMap = new HashMap<>();
        this.header = "963beb3afb5d58b15e07860c6a44c2fa0baef085bf21f27e202a5f0bb02f9807";
        this.playloadMap.put("iss", "bilibili.com");
    }

    public Token(String token) {
        String[] tokens = token.split("\\.");
        if (tokens.length == 3) {
            this.header = tokens[0];
            this.playloadStr = tokens[1];
            byte[] deByte = Base64.getDecoder().decode(tokens[1]);
            String deStr = null;
            try {
                deStr = new String(deByte,"UTF-8");
            } catch (IOException e) {
                e.printStackTrace();
            }
            JSONObject jsonObject = JSONObject.fromObject(deStr);
            Set<String> set = jsonObject.keySet();
            playloadMap = new HashMap<>();
            for (String key : set) {
                playloadMap.put(key, jsonObject.getString(key));
            }
            this.signature = tokens[2];
        }
    }

    public Map<String, String> getPlayloadMap() {
        return this.playloadMap;
    }


    public void setData(String username) {
        Map<String, String> userInfo = UserDao.getUserInfo(username);
        for (Map.Entry<String, String> entry : userInfo.entrySet()) {
            this.playloadMap.put(entry.getKey(), entry.getValue());
        }
    }

    public void setSub(String sub) {
        playloadMap.put("sub", sub);
    }

    public void setTime(long time) {
        long nowTime = new Date().getTime() / 1000;
        playloadMap.put("nbf", String.valueOf((long)Math.ceil(nowTime)));
        playloadMap.put("iat", String.valueOf(nowTime));
        playloadMap.put("exp", String.valueOf((long)Math.ceil(nowTime + time)));
    }

    public String getToken() {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        for (Map.Entry<String, String> entry : playloadMap.entrySet()) {
            sb.append("'").append(entry.getKey()).append("':'")
                    .append(entry.getValue()).append("',");
        }
        sb.delete(sb.length() - 1, sb.length());
        sb.append("}");
        this.playloadStr = sb.toString();
        String base64Playload = null;
        try {
            base64Playload = Base64.getEncoder().encodeToString(sb.toString().getBytes("UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        String signature = this.header + "." + base64Playload;
        this.signature = signature;

        String hs256Signature = SecretUtil.encoderHs256(signature);
        return this.header + "." + base64Playload + "." + hs256Signature;
    }


    public boolean isToken() {
        if (this.header != null && this.playloadStr != null && this.signature != null) {
            String userSignature = SecretUtil.encoderHs256(header + "." + playloadStr);
            if (this.signature.equals(userSignature)) {
                return true;
            }
        }
        return false;
    }

    public boolean isNotTokenOverTime() {
        long tokenExp = Long.parseLong(playloadMap.get("exp"));
        long tokenNbf = Long.parseLong(playloadMap.get("nbf"));
        long nowTime = (long) Math.ceil(new Date().getTime() / 1000);
        return tokenExp >= nowTime && nowTime >= tokenNbf;
    }


    public static void main(String[] args) {
        Token token = new Token();
        token.setData("admin");
        token.setSub("admin");
        token.setTime(10000L);
        Token t = new Token(token.getToken());
    }
}
