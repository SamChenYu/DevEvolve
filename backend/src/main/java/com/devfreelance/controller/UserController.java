package com.devfreelance.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.devfreelance.config.JwtProvider;
import com.devfreelance.models.Admin;
import com.devfreelance.models.Bids;
import com.devfreelance.models.Client;
import com.devfreelance.models.Developer;
import com.devfreelance.repository.AdminRepository;
import com.devfreelance.repository.ClientRepository;
import com.devfreelance.repository.DeveloperRepository;
import com.devfreelance.response.UserRoleResponse;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@RestController
@RequestMapping("/auth/users")
public class UserController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private DeveloperRepository developerRepository;

    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/{userId}")
    public Object getUser(@PathVariable Integer userId) throws Exception {
        Optional<Client> client = clientRepository.findById(userId);
        if (client.isPresent()) return client.get();

        Optional<Developer> developer = developerRepository.findById(userId);
        if (developer.isPresent()) return developer.get();

        throw new Exception("User not found.");
    }
    
    @GetMapping("/all")
    public ResponseEntity<?> getAllDevelopers(@CookieValue(name = "access_token", required = false) String token) {
    	if (token == null || !JwtProvider.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: Invalid token");
        }
    	
    	return ResponseEntity.ok(developerRepository.findAll());
    	
    }

    @DeleteMapping("/{userId}")
    public String deleteUser(@PathVariable Integer userId) throws Exception {
        if (clientRepository.existsById(userId)) {
            clientRepository.deleteById(userId);
            return "Client deleted successfully.";
        } else if (developerRepository.existsById(userId)) {
            developerRepository.deleteById(userId);
            return "Developer deleted successfully.";
        } else {
            throw new Exception("User not found.");
        }
    }

    @GetMapping("/search")
    public List<Object> searchUser(@RequestParam("query") String query) {
        List<Object> users = new ArrayList<>();
        //users.addAll(clientRepository.searchUser(query));
        users.addAll(developerRepository.searchUser(query));
        return users;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserFromToken(@CookieValue(name = "access_token", required = false) String token) {
        if (token == null || !JwtProvider.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: Invalid token");
        }

        String extractedEmail = JwtProvider.extractEmail(token);

        Optional<Client> client = clientRepository.findByEmail(extractedEmail);
        if (client.isPresent()) return ResponseEntity.ok(new UserRoleResponse(client.get(), "CLIENT"));

        Optional<Developer> developer = developerRepository.findByEmail(extractedEmail);
        if (developer.isPresent()) return ResponseEntity.ok(new UserRoleResponse(developer.get(), "DEVELOPER"));

        Optional<Admin> admin = adminRepository.findByEmail(extractedEmail);
        if (admin.isPresent()) return ResponseEntity.ok(new UserRoleResponse(admin.get(), "ADMIN"));

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
    }

}
