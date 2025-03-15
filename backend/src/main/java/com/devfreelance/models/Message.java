package com.devfreelance.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "message")
public class Message {

    public Message() {
    }
    public Message(MessageID messageID) {
        this.messageID = messageID;
    }

    @EmbeddedId
    private MessageID messageID;

    @Column(name = "`from`") // quotations because from is a reserved keyword in sql
    private String from;

    @Column(name = "text")
    private String text;

    @Column(name = "timestamp")
    private String timestamp;

    @ManyToOne
    @JoinColumn(name = "chatID", insertable = false, updatable = false)
    @JsonBackReference
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
}
