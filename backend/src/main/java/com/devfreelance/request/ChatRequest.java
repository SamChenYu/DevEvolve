package com.devfreelance.request;

public class ChatRequest {


    // Used for when frontend passes in clientName and developerName
    private String clientEmail;
    private String developerEmail;

    public ChatRequest() {
        super();
    }

    public ChatRequest(String clientEmail, String developerEmail) {
        super();
        this.clientEmail = clientEmail;
        this.developerEmail = developerEmail;
    }

    public String getClientEmail() {
        return clientEmail;
    }

    public String getDeveloperEmail() {
        return developerEmail;
    }
}
