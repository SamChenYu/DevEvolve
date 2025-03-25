package com.devfreelance.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Issues {
    @Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;

    private String title;
    private String description;
    private IssueType type;

    public Issues() {
        super();
    }

    public Issues(Integer id, String title, String description, IssueType type) {
        super();
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public IssueType getType() {
        return type;
    }

    public void setType(IssueType type) {
        this.type = type;
    }
}
