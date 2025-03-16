package com.devfreelance.controller;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devfreelance.config.JwtProvider;
import com.devfreelance.models.Client;
import com.devfreelance.models.Developer;
import com.devfreelance.repository.ClientRepository;
import com.devfreelance.repository.DeveloperRepository;
import com.devfreelance.request.LoginRequest;
import com.devfreelance.response.AuthResponse;
import com.devfreelance.response.RegisterResponse;
import com.devfreelance.service.UserDetailService;

import jakarta.servlet.http.HttpServletResponse;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private DeveloperRepository developerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserDetailService userDetailService;

	
	
    @PostMapping("/register/client")
    public RegisterResponse registerClient(@RequestBody Client client) throws Exception {
        Optional<Client> isExist = clientRepository.findByEmail(client.getEmail());
        if (isExist.isPresent()) {
            throw new Exception("Email already used with another account.");
        }

        Client newClient = new Client();
        newClient.setFirstName(client.getFirstName());
        newClient.setLastName(client.getLastName());
        newClient.setEmail(client.getEmail());
        newClient.setPassword(passwordEncoder.encode(client.getPassword()));
        newClient.setCoins(1000);  
        

        Client registeredClient = clientRepository.save(newClient);

        return new RegisterResponse("Client successfully registered.", "CLIENT", registeredClient.getId());
    }
    
    @PostMapping(value = "/register/developer")
    public RegisterResponse registerDeveloper(@RequestBody Developer developer) throws Exception {
        if (developer.getEmail() == null || developer.getPassword() == null) {
            throw new Exception("Invalid data. Email and password are required.");
        }

        Optional<Developer> isExist = developerRepository.findByEmail(developer.getEmail());
        if (isExist.isPresent()) {
            throw new Exception("Email already used with another account.");
        }

        Developer newDeveloper = new Developer();
        newDeveloper.setFirstName(developer.getFirstName());
        newDeveloper.setLastName(developer.getLastName());
        newDeveloper.setEmail(developer.getEmail());
        newDeveloper.setPassword(passwordEncoder.encode(developer.getPassword()));
        newDeveloper.setCoins(1000);
        newDeveloper.setCoinsEarnedAllTime(0);
        newDeveloper.setLevel("Novice");

        Developer registeredDeveloper = developerRepository.save(newDeveloper);

        return new RegisterResponse("Developer successfully registered.", "DEVELOPER", registeredDeveloper.getId());
    }
	

    
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        Authentication authorised = authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        String token = JwtProvider.generateToken(authorised);
        String refreshToken = JwtProvider.generateRefreshToken(authorised);
        
        ResponseCookie accessCookie = ResponseCookie.from("access_token", token)
                .httpOnly(true)
                .secure(true) 
                .sameSite("Strict")
                .path("/")
                .maxAge(Duration.ofHours(1))
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", refreshToken)
            .httpOnly(true)
            .secure(true)
            .sameSite("Strict")
            .path("/")
            .maxAge(Duration.ofDays(7))
            .build();
        
        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
        
        Optional<Developer> developer = developerRepository.findByEmail(loginRequest.getEmail());
        if (developer.isPresent()) {
            return new AuthResponse(token, "User successfully logged in.", "DEVELOPER", developer.get().getId());
        }

        Optional<Client> client = clientRepository.findByEmail(loginRequest.getEmail());
        if (client.isPresent()) {
            return new AuthResponse(token, "User successfully logged in.", "CLIENT", client.get().getId());
        }

        throw new RuntimeException("User not found.");
    }

	private Authentication authenticate(String email, String password) {
		UserDetails userDetails = userDetailService.loadUserByUsername(email);
		
		if(userDetails==null) {
			throw new BadCredentialsException("invalid username");
		}
		if(!passwordEncoder.matches(password, userDetails.getPassword())) {
			throw new BadCredentialsException("invalid username or password.");
		}
		
		return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
	}
	
	@PostMapping("/refresh")
	public ResponseEntity<?> refreshAccessToken(@CookieValue(name = "refresh_token", required = false) String refreshToken, HttpServletResponse response) {
	    if (refreshToken == null || !JwtProvider.isTokenValid(refreshToken)) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
	    }

	    String email = JwtProvider.extractEmail(refreshToken);
	    Authentication auth = new UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());

	    String newAccessToken = JwtProvider.generateToken(auth);

	    ResponseCookie newAccessCookie = ResponseCookie.from("access_token", newAccessToken)
	        .httpOnly(true)
	        .secure(true)
	        .sameSite("Strict")
	        .path("/")
	        .maxAge(Duration.ofMinutes(15))
	        .build();

	    response.addHeader(HttpHeaders.SET_COOKIE, newAccessCookie.toString());

	    return ResponseEntity.ok("Token refreshed");
	}
	
	@PostMapping("/logout")
	public ResponseEntity<?> logout(HttpServletResponse response) {
	    ResponseCookie accessCookie = ResponseCookie.from("access_token", "")
	        .httpOnly(true)
	        .secure(true)
	        .sameSite("Strict")
	        .path("/")
	        .maxAge(0) // Expire immediately
	        .build();

	    ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", "")
	        .httpOnly(true)
	        .secure(true)
	        .sameSite("Strict")
	        .path("/")
	        .maxAge(0)
	        .build();

	    response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
	    response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

	    return ResponseEntity.ok("Logged out");
	}
}
