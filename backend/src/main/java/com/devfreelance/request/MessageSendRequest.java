package com.devfreelance.request;

import com.devfreelance.models.Message;
import com.devfreelance.models.MessageID;

public class MessageSendRequest {

    private String chatID;
    private int message_ID;

    private String from;
    private String text;
    private String timestamp;

    public MessageSendRequest(String chatID, int message_ID, String from, String text, String timestamp) {
        this.chatID = chatID;
        this.message_ID = message_ID;
        this.from = from;
        this.text = text;
        this.timestamp = timestamp;
    }

    public String getChatID() {
        return chatID;
    }

    public int getMessageID() {
        return message_ID;
    }

    public String getFrom() {
        return from;
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

    public void setFrom(String from) {
        this.from = from;
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public Message toMessage() {
        System.out.println("Converting MessageSendRequest to Message with variables " + message_ID + " " + chatID + " " + from + " " + text + " " + timestamp);
        return new Message(message_ID, chatID, from, text, timestamp);
    }

}
