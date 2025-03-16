 package com.devfreelance.config;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.security.core.Authentication;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;

public class JwtProvider {
	private static SecretKey key = Keys.hmacShaKeyFor("jflkrejglkjlkrgjlkrglkjglrejglghgjhgjgutugghhghjhgvghjbhjgjutgukhjkhkh".getBytes());
	
	public static String generateToken(Authentication auth) {
		
		String jwt = Jwts.builder().setIssuer("DevEvolve").setIssuedAt(new Date()).setExpiration(new Date(new Date().getTime() + 3600000)).claim("email", auth.getName()).signWith(key).compact();
		return jwt;
	}
	
	public static String generateRefreshToken(Authentication auth) {
		return Jwts.builder().setIssuer("DevEvolve").setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000)).claim("email", auth.getName()).signWith(key).compact();
		
	}
	
	public static String extractEmail(String jwt) {
		
		if (jwt.startsWith("Bearer ")) {
	        jwt = jwt.substring(7);  // Remove "Bearer " prefix
	    }
		try {
	        Claims claims = Jwts.parser()
	                            .setSigningKey(key)
	                            .build()
	                            .parseClaimsJws(jwt)  
	                            .getBody();
	        return String.valueOf(claims.get("email")); 
	    } catch (Exception e) {
	        e.printStackTrace(); 
	        return null;
	    }
	}
	
	public static Claims extractClaims(String jwt) {
		if (jwt.startsWith("Bearer ")) {
	        jwt = jwt.substring(7);  
	    } 
	    return Jwts.parser()
	            .setSigningKey(key)  
	            .build()
	            .parseClaimsJws(jwt)
	            .getBody();
	}
	
	public static boolean isTokenValid(String token) {
		try {
	        Jwts.parser()
	            .setSigningKey(key)
	            .build()
	            .parseClaimsJws(token); 
	        return true;
	    } catch (ExpiredJwtException e) {
	        
	        return false;
	    } catch (SignatureException e) {
	        
	        return false;
	    } catch (Exception e) {
	        
	        return false;
	    }
    }
}
