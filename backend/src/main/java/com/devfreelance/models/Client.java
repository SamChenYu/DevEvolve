package com.devfreelance.models;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.ArrayList;
import java.util.List;



@Entity
public class Client extends Users {

    
	@OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("client-projects") 
    private List<Projects> ownedProjects = new ArrayList<>();

	@OneToMany(mappedBy = "developer", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference
	private List<Chat> chats = new ArrayList<>();

	public Client() {
		super();
		// TODO Auto-generated constructor stub
	}



	public Client(List<Projects> ownedProjects) {
		super();
		this.ownedProjects = ownedProjects;
	}



	public List<Projects> getOwnedProjects() {
		return ownedProjects;
	}



	public void setOwnedProjects(List<Projects> ownedProjects) {
		this.ownedProjects = ownedProjects;
	}
	
	
	

	
	
	
	
}
