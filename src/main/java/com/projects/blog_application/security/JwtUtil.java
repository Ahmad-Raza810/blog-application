package com.projects.blog_application.security;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@RequiredArgsConstructor
@Component
public class JwtUtil {


    @Value("${jwt.private-key}")
    private String secret;

    @Value("${jwt.exptime}")
    private Long expTime;

    //sign key
    private Key getSignKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }


    //method for checking token is expired or not
    public boolean isTokenExpired(String token){
        return extractAllClaims(token).getExpiration().before(new Date());

    }

    //method for generate token
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expTime))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();

    }


    //method for validate token
    public boolean validateToken(String token, UserDetails userDetails){
        return (userDetails.getUsername().equals(extractUsername(token)) && !isTokenExpired(token));

    }

    //method for extreact claims
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }


    //method for extract username from claims
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();

    }

    //method for extract jwt from request
    public String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }



}
