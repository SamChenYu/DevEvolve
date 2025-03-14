package com.devfreelance.models;

import jakarta.persistence.Embeddable;

import java.io.Serializable;

/*
    * This class is used to create a composite primary key for the Messages table.
 */



@Embeddable
public class MessagesID implements Serializable {
    private String chatID;
    private int messageID;

    public String getChatID() {
        return chatID;
    }

    public void setChatID(String chatID) {
        this.chatID = chatID;
    }

    public int getMessageID() {
        return messageID;
    }

    public void setMessageID(int messageID) {
        this.messageID = messageID;
    }



}
