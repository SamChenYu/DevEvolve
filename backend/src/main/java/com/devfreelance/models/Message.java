package com.devfreelance.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "message")
public class Message {

    public Message() {
        this.messageID = new MessageID();
    }

    public Message(int messageID, String chatID, String sender, String text, String timestamp) {
        this.messageID = new MessageID(chatID, messageID);
        this.sender = sender;
        this.text = text;
        this.timestamp = timestamp;
    }

    @EmbeddedId
    private MessageID messageID = new MessageID();

    @Column(name = "sender")
    private String sender;

    @Column(name = "text")
    private String text;

    @Column(name = "timestamp")
    private String timestamp;

    @ManyToOne
    @MapsId("chatID")
    @JsonIgnore
    private Chat chat;


    public void setMessageID(int i) {
        messageID.setMessageID(i);
    }

    public String getChatID() {
        return messageID.getChatID();
    }

    public int getMessageID() {
        return messageID.getMessageID();
    }

    public void setChat(Chat chat) {
        this.chat = chat;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public String getText() {
        return text;
    }

    public String getSender() {
        return sender;
    }
}
