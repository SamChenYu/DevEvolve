package com.devfreelance.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Admin {

    @Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;

    private String email;
    private String password;
    

    public Admin() {
    }

    public Admin(Integer id, String email, String password) {
        this.id = id;
        this.email = email;
        this.password = password;
        
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    
}
