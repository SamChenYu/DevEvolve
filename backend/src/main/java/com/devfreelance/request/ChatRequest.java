package com.devfreelance.request;

public class ChatRequest {


    // These two are used for when frontend passes in clientName and developerName
    private String clientID;
    private String developerID;


    // These two are used for when user searches for another user's name
    private String searchRequest;
    private boolean isClient;

    public ChatRequest() {
        super();
    }

    public ChatRequest(String clientID, String developerID) {
        super();
        this.clientID = clientID;
        this.developerID = developerID;
    }

    public String getClientID() {
        return clientID;
    }

    public String getDeveloperID() {
        return developerID;
    }

    public void setClientID(String clientID) {
        this.clientID = clientID;
    }

    public void setDeveloperID(String developerID) {
        this.developerID = developerID;
    }

    public void setSearchRequest(String searchRequest) {
        this.searchRequest = searchRequest;
    }

    public String getSearchRequest() {
        return searchRequest;
    }


    public boolean getIsClient() {
        return isClient;
    }

    public void setIsClient(boolean isClient) {
        this.isClient = isClient;
    }


}
