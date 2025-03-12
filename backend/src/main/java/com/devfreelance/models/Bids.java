package com.devfreelance.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
    
    @Enumerated(EnumType.STRING)
    private BidStatus status = BidStatus.PENDING;
    
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
    }

    public Bids(Integer id, Integer amount, String proposal, BidStatus status, Developer developer, Projects project) {
        this.id = id;
        this.amount = amount;
        this.proposal = proposal;
        this.status = status;
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

    public BidStatus getStatus() {
        return status;
    }

    public void setStatus(BidStatus status) {
        this.status = status;
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