package com.devfreelance.request;

public class ChatRequest {


    // Used for when frontend passes in clientName and developerName
    private String clientID;
    private String developerID;

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
}
