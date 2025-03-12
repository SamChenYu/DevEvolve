package com.devfreelance.response;

import com.devfreelance.models.Bids;

public class BidResponse {
    private Integer id;
    private Integer amount;
    private String proposal;
    private boolean accepted;
    private Integer developerId;
    private String developerName; 
    private Integer projectId;

    public BidResponse(Bids bid) {
        this.id = bid.getId();
        this.amount = bid.getAmount();
        this.proposal = bid.getProposal();
        this.accepted = bid.isAccepted();
        this.developerId = (bid.getDeveloper() != null) ? bid.getDeveloper().getId() : null;
        this.developerName = (bid.getDeveloper() != null) ? bid.getDeveloper().getFirstName() + " " + bid.getDeveloper().getLastName() : "Unknown";
        this.projectId = (bid.getProject() != null) ? bid.getProject().getId() : null;
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

    public Integer getDeveloperId() {
        return developerId;
    }

    public void setDeveloperId(Integer developerId) {
        this.developerId = developerId;
    }

    public String getDeveloperName() {
        return developerName;
    }

    public void setDeveloperName(String developerName) {
        this.developerName = developerName;
    }

    public Integer getProjectId() {
        return projectId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }

}
