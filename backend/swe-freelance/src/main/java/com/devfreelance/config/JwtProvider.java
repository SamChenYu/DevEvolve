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
		return Jwts.builder().setIssuer("DevEvolve").setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000)).signWith(key).compact();
		
	}
	
	public static String extractEmail(String jwt) {
		
		if (jwt.startsWith("Bearer ")) {
	        jwt = jwt.substring(7);  // Remove "Bearer " prefix
	    }
		try {
	        Claims claims = Jwts.parser()
	                            .setSigningKey(key)
	                            .build()
	                            .parseClaimsJws(jwt)  // Parse the JWT to extract claims
	                            .getBody();
	        return String.valueOf(claims.get("email")); // Extract "email" claim
	    } catch (Exception e) {
	        e.printStackTrace(); // Print the exception to see if there's a parsing issue
	        return null;
	    }
	}
	
	public static Claims extractClaims(String jwt) {
		if (jwt.startsWith("Bearer ")) {
	        jwt = jwt.substring(7);  // Remove "Bearer " prefix
	    } // Remove "Bearer " prefix
	    return Jwts.parser()
	            .setSigningKey(key)  // Use setSigningKey instead of verifyWith
	            .build()
	            .parseClaimsJws(jwt)
	            .getBody();
	}
	
	public static boolean isTokenValid(String token) {
		try {
	        Jwts.parser()
	            .setSigningKey(key) // Set the signing key
	            .build()
	            .parseClaimsJws(token); // This will throw an exception if the token is invalid
	        return true;
	    } catch (ExpiredJwtException e) {
	        // Handle expired token
	        return false;
	    } catch (SignatureException e) {
	        // Handle invalid signature
	        return false;
	    } catch (Exception e) {
	        // Handle other exceptions (e.g., malformed token)
	        return false;
	    }
    }
}
