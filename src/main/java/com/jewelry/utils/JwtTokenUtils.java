package com.jewelry.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.GrantedAuthority;
@Component
public class JwtTokenUtils {
    @Value("dfghjklzxvberyusdopbnqwzxtyusdhjipocvnmrt")
    private String secret;
    @Value("30m")
    private Duration jwtLifeTime;
    public String generateToken(UserDetails userDetails){
        Map<String,Object> claims = new HashMap<>();
        List<String> roles = userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        claims.put("roles", roles);
        Date createDate = new Date();
        Date expirationDate = new Date(createDate.getTime()+jwtLifeTime.toMillis());
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(createDate)
                .setExpiration(expirationDate)
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }
    public String getUsername(String token) {
        return getAllClaimsFromToken(token).getSubject();
    }
    private Claims getAllClaimsFromToken (String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
    }
    public List<String> getRoles(String token) {
        return getAllClaimsFromToken(token).get("roles", List.class);
    }
}
