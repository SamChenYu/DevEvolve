package com.devfreelance.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "messages")
public class Messages {

    @EmbeddedId
    private MessagesID messagesID;

    @Column(name = "'from'") // quotations because from is a reserved keyword in sql
    private String from;

    @Column(name = "text")
    private String text;

    @Column(name = "timestamp")
    private String timestamp;

    @ManyToOne
    @JoinColumn(name = "chatID", insertable = false, updatable = false)
    @JsonBackReference
    private Chats chats;

}
