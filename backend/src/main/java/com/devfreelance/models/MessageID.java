package com.devfreelance.models;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;

/*
 * This class is used to create a composite primary key for the Messages table.
 */



@Embeddable
public class MessageID implements Serializable {

    private String chatID;

    private int message_ID;

    public MessageID(String chatID, int messageID) {
        this.chatID = chatID;
        this.message_ID = messageID;
        System.out.println("MessageID created with chatID: " + chatID + " and messageID: " + messageID);
    }

    public MessageID() {
        chatID = "";
        message_ID = 0;
    }

    public String getChatID() {
        return chatID;
    }

    public int getMessageID() {
        return message_ID;
    }

    public void setMessageID(int messageID) {
        this.message_ID = messageID;
    }



}