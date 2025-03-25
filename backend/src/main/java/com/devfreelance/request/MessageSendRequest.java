package com.devfreelance.request;

import com.devfreelance.models.Message;
import com.devfreelance.models.MessageID;

public class MessageSendRequest {

    private String chatID;
    private int message_ID;

    private String sender;
    private String text;
    private String timestamp;

    public MessageSendRequest(String chatID, int message_ID, String sender, String text, String timestamp) {
        this.chatID = chatID;
        this.message_ID = message_ID;
        this.sender = sender;
        this.text = text;
        this.timestamp = timestamp;
    }

    public String getChatID() {
        return chatID;
    }

    public int getMessageID() {
        return message_ID;
    }

    public String getSender() {
        return sender;
    }

    public String getText() {
        return text;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setMessageID(int message_ID) {
        this.message_ID = message_ID;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public Message toMessage() {
        System.out.println("Converting MessageSendRequest to Message with variables " + message_ID + " " + chatID + " " + sender + " " + text + " " + timestamp);
        return new Message(message_ID, chatID, sender, text, timestamp);
    }

}
