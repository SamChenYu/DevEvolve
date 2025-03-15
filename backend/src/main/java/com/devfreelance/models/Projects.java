package com.devfreelance.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;



@Entity
public class Projects {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    
    private String title;
    private String description;
    private Integer cost = 250;
    private String repoLink;
    private String finalReport;
    private LocalDateTime postedAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private ProjectStatus status = ProjectStatus.FINDING_DEVELOPER;
    
    @ManyToOne
    @JoinColumn(name = "client_id")
    @JsonBackReference("client-projects")
    private Client client;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("project-bids")
    private List<Bids> bids = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "developer_id")
    @JsonBackReference("developer-projects")
    private Developer developer;
    
    public Projects() {
        super();
    }

    public Projects(Integer id, String title, String description, Integer cost, String repoLink, String finalReport, LocalDateTime postedAt,
                    ProjectStatus status, Client client, List<Bids> bids, Developer developer) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.cost = cost;
        this.repoLink = repoLink;
        this.finalReport = finalReport;
        this.postedAt = postedAt;
        this.status = status;
        this.client = client;
        this.bids = bids;
        this.developer = developer;
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

    public Integer getCost() {
        return cost;
    }

    public void setCost(Integer cost) {
        this.cost = cost;
    }

    public String getRepoLink() {
        return repoLink;
    }

    public void setRepoLink(String repoLink) {
        this.repoLink = repoLink;
    }

    public String getFinalReport() {
        return finalReport;
    }

    public void setFinalReport(String finalReport) {
        this.finalReport = finalReport;
    }

    public LocalDateTime getPostedAt() {
        return postedAt;
    }

    public void setPostedAt(LocalDateTime postedAt) {
        this.postedAt = postedAt;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public List<Bids> getBids() {
        return bids;
    }

    public void setBids(List<Bids> bids) {
        this.bids = bids;
    }

    public Developer getDeveloper() {
        return developer;
    }

    public void setDeveloper(Developer developer) {
        this.developer = developer;
    }
}
