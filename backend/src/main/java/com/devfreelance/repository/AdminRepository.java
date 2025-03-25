package com.devfreelance.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devfreelance.models.Admin;

public interface AdminRepository extends JpaRepository<Admin, Integer> {
    Optional<Admin> findByEmail(String email);
    Admin findByEmailAndPassword(String email, String password);

    
}
