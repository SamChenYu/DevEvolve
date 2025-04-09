package com.devfreelance.response;

import java.time.LocalDateTime;
import java.util.List;

import com.devfreelance.models.Bids;
import com.devfreelance.models.ProjectStatus;
import com.devfreelance.models.Projects;

public class ProjectResponse {

    private Integer id;
    private String title;
    private String description;
    private Integer cost;
    private String repoLink;
    private String finalReport;
    private String imageUrl;
    private LocalDateTime postedAt;
    private LocalDateTime RatingDeadlineReference;
    private ProjectStatus status;
    private Integer clientId;
    private Integer developerId;
    private List<Bids> bids;

    // Constructor to populate the DTO from a Projects entity
    public ProjectResponse(Projects project) {
        this.id = project.getId();
        this.title = project.getTitle();
        this.description = project.getDescription();
        this.cost = project.getCost();
        this.repoLink = project.getRepoLink();
        this.finalReport = project.getFinalReport();
        this.imageUrl = project.getImageUrl();
        this.postedAt = project.getPostedAt();
        this.RatingDeadlineReference = project.getRatingDeadlineReference();
        this.status = project.getStatus();
        this.clientId = (project.getClient() != null) ? project.getClient().getId() : null;
        this.developerId = (project.getDeveloper() != null) ? project.getDeveloper().getId() : null;
        this.bids = project.getBids();
    }

    // Getters and setters

    public Integer getProjectId() {
        return id;
    }

    public void setProjectId(Integer projectId) {
        this.id = projectId;
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

    public LocalDateTime getRatingDeadlineReference() {
        return RatingDeadlineReference;
    }

    public void setRatingDeadlineReference(LocalDateTime ratingDeadlineReference) {
        this.RatingDeadlineReference = ratingDeadlineReference;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public Integer getClientId() {
        return clientId;
    }

    public void setClientId(Integer clientId) {
        this.clientId = clientId;
    }

    public Integer getDeveloperId() {
        return developerId;
    }

    public void setDeveloperId(Integer developerId) {
        this.developerId = developerId;
    }

    public List<Bids> getBids() {
        return bids;
    }

    public void setBids(List<Bids> bids) {
        this.bids = bids;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

}
