package com.blogapp.security;


import com.blogapp.exception.BlogAPIException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${app.jwtSecret}")
    private String jwtSecret;

    @Value("${app.jwtExpirationMilliseconds}")
    private long jwtExpirationDate;

    public String generateToken(Authentication authentication) {
        String username = authentication.getName();

        Date currentDate = new Date();
        Date expirateDate = new Date(currentDate.getTime() + jwtExpirationDate);
//        System.out.println("Token Generating ");

        String token = Jwts.builder()
                .subject(username)
                .issuedAt(currentDate)
                .expiration(expirateDate)
                .signWith(key())
                .compact();

//        System.out.println("Token Generated " + token);

        return token;
    }

    private SecretKey key() {
//        System.out.println("key for token : " + Decoders.BASE64.decode(jwtSecret));
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String getUsername(String token) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token) {

        try {
//            System.out.println("Validating token...");
            Jwts.parser()
                    .verifyWith(key())
                    .build()
                    .parse(token);
//            System.out.println("Validating Completed");

            return true;
        } catch (MalformedJwtException malformedJwtException) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "Invalid JWT token");
        } catch (ExpiredJwtException expiredJwtException) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "Expired JWT token");
        } catch (UnsupportedJwtException unsupportedJwtException) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "Unsupported JWT token");
        } catch (IllegalArgumentException illegalArgumentException) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "Jwt claims string is null or empty");
        } catch (Exception ex) {
            throw new BlogAPIException(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong in JWT token");
        }
    }

}
