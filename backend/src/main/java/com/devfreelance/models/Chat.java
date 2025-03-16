package com.devfreelance.models;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chat")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Chat {

    public Chat() {

    }

    public Chat(Client client, Developer developer) {
        this.client = client;
        this.developer = developer;
    }

    @Id
    @Column(name = "chatID")
    private String chatID = java.util.UUID.randomUUID().toString();;


    @ManyToOne
    @JoinColumn(name = "client", nullable = false)
    @JsonBackReference("client-chats")  // Prevents infinite recursion
    private Client client;

    @ManyToOne
    @JoinColumn(name = "developer", nullable = false)
    @JsonBackReference("developer-chats")  // Prevents infinite recursion
    private Developer developer;

    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL)
    @JsonManagedReference // Manage references for JSON serialization
    private List<Message> messages = new ArrayList<>();


    @Column(name = "currentMessageID")
    private int currentMessageID = 0; // keeps track of messages size (used for updating sockets)



    public void addMessage(Message newMessage) {
        if(messages == null) {
            messages = new ArrayList<>();
        }
        messages.add(newMessage);
        currentMessageID++;
    }




    public String getChatID() {
        return chatID;
    }


    public List<Message> getMessages() {
        return messages;
    }

    public int getCurrentMessageID() {
        return currentMessageID;
    }


    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }


    public Client getClient() {
        return client;
    }

    public Developer getDeveloper() {
        return developer;
    }
}
