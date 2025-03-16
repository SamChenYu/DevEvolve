package com.devfreelance.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;


@Entity
@Table(name = "ratings")
public class Ratings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer ratingOutOfFive;
    private String feedback;

    @ManyToOne
    @JoinColumn(name = "developer_id")
    @JsonBackReference("developer-ratings")
    private Developer developer;

	@OneToOne
	@JoinColumn(name = "project_id")
	@JsonBackReference("project-rating")
	private Projects project;
	
	public Ratings() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Ratings(Integer id, Integer ratingOutOfFive, String feedback, Developer developer, Projects project) {
		super();
		this.id = id;
		this.ratingOutOfFive = ratingOutOfFive;
		this.feedback = feedback;
		this.developer = developer;
		this.project = project;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getRatingOutOfFive() {
		return ratingOutOfFive;
	}

	public void setRatingOutOfFive(Integer ratingOutOfFive) {
		this.ratingOutOfFive = ratingOutOfFive;
	}

	public String getFeedback() {
		return feedback;
	}

	public void setFeedback(String feedback) {
		this.feedback = feedback;
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
