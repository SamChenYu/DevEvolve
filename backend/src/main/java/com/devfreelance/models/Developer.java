package com.devfreelance.models;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


@Entity
public class Developer extends Users {
	
	private Integer coinsEarnedAllTime = 0;
    private String level = "Novice";
	
	@OneToMany(mappedBy = "developer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("developer-bids")
    private List<Bids> allBids = new ArrayList<>();

    @OneToMany(mappedBy = "developer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("developer-ratings")
    private List<Ratings> ratings = new ArrayList<>();
    
    @OneToMany(mappedBy = "developer")
    @JsonManagedReference("developer-projects")
    private List<Projects> completedProjects = new ArrayList<>();

	public Developer() {
		super();
		// TODO Auto-generated constructor stub
	}


	public Developer(Integer coinsEarnedAllTime, String level, List<Bids> allBids, List<Ratings> ratings,
			List<Projects> completedProjects) {
		super();
		this.coinsEarnedAllTime = coinsEarnedAllTime;
		this.level = level;
		this.allBids = allBids;
		this.ratings = ratings;
		this.completedProjects = completedProjects;
	}


	public Integer getCoinsEarnedAllTime() {
		return coinsEarnedAllTime;
	}


	public void setCoinsEarnedAllTime(Integer coinsEarnedAllTime) {
		this.coinsEarnedAllTime = coinsEarnedAllTime;
	}


	public String getLevel() {
		return level;
	}


	public void setLevel(String level) {
		this.level = level;
	}


	public List<Bids> getAllBids() {
		return allBids;
	}


	public void setAllBids(List<Bids> allBids) {
		this.allBids = allBids;
	}


	public List<Ratings> getRatings() {
		return ratings;
	}


	public void setRatings(List<Ratings> ratings) {
		this.ratings = ratings;
	}


	public List<Projects> getCompletedProjects() {
		return completedProjects;
	}


	public void setCompletedProjects(List<Projects> completedProjects) {
		this.completedProjects = completedProjects;
	}


	public void updateLevel() {
        if (coinsEarnedAllTime >= 50000) {
            level = "Expert";
        } else if (coinsEarnedAllTime >= 20000) {
            level = "Advanced";
        } else if (coinsEarnedAllTime >= 5000) {
            level = "Intermediate";
        } else {
            level = "Novice";
        }
    }
	
}
