package com.devfreelance.request;

public class MessageUpdateRequest {
    // Used for when frontend passes in chatID and messageID to update newer messages

    private String chatID;
    private int messageID;

    public MessageUpdateRequest() {
        super();
    }

    public MessageUpdateRequest(String chatID, int messageID) {
        super();
        this.chatID = chatID;
        this.messageID = messageID;
    }

    public String getChatID() {
        return chatID;
    }

    public int getMessageID() {
        return messageID;
    }
}
