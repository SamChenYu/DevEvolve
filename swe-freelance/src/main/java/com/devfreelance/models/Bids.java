package com.devfreelance.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;


@Entity
@Table(name = "bids")
public class Bids {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	private Integer amount;
	private String proposal;
	private boolean accepted = false;
	
	@ManyToOne
	@JoinColumn(name = "developer_id")
	@JsonBackReference("developer-bids")
	private Developer developer;
	
	
	@ManyToOne
	@JoinColumn(name = "project_id")
	@JsonBackReference("project-bids")
	private Projects project;


	public Bids() {
		super();
		// TODO Auto-generated constructor stub
	}


	public Bids(Integer id, Integer amount, String proposal, boolean accepted, Developer developer, Projects project) {
		super();
		this.id = id;
		this.amount = amount;
		this.proposal = proposal;
		this.accepted = accepted;
		this.developer = developer;
		this.project = project;
	}


	public Integer getId() {
		return id;
	}


	public void setId(Integer id) {
		this.id = id;
	}


	public Integer getAmount() {
		return amount;
	}


	public void setAmount(Integer amount) {
		this.amount = amount;
	}


	public String getProposal() {
		return proposal;
	}


	public void setProposal(String proposal) {
		this.proposal = proposal;
	}


	public boolean isAccepted() {
		return accepted;
	}


	public void setAccepted(boolean accepted) {
		this.accepted = accepted;
	}


	public Developer getDeveloper() {
		return developer;
	}


	public void setDeveloper(Developer developer) {
		this.developer = developer;
	}


	public Projects getProject() {
		return project;
	}


	public void setProject(Projects project) {
		this.project = project;
	}
	
	
	
}
