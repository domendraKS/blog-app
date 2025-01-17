package com.blogapp.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

public class CookieUtils {

    public static void addJwtCookie(String jwtToken, HttpServletResponse response) {
        // Create a cookie to store the JWT token
        Cookie cookie = new Cookie("blog-cookie", jwtToken);

        // Set cookie properties
        cookie.setHttpOnly(true); // Can't be accessed via JavaScript
        cookie.setSecure(true);   // Ensure the cookie is only sent over HTTPS
        cookie.setPath("/");      // Accessible across the entire domain
        cookie.setMaxAge(86400);   // Set the expiration time (1 hour in seconds)

        response.addCookie(cookie);
    }

    public static void clearCookie(HttpServletResponse response){
        Cookie cookie = new Cookie("blog-cookie", null);

        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);

        response.addCookie(cookie);
    }
}

