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

    @Column(name = "name1")
    private String name1 = "";

    @Column(name = "name2")
    private String name2 = "";


    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    @JsonBackReference("client-chats")  // Prevents infinite recursion
    private Client client;

    @ManyToOne
    @JoinColumn(name = "developer_id", nullable = false)
    @JsonBackReference("developer-chats")  // Prevents infinite recursion
    private Developer developer;

    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL)
    @JsonManagedReference("chat-messages")
    private List<Message> messages = new ArrayList<>();


    @Column(name = "currentMessageID")
    private int currentMessageID = 0; // keeps track of messages size (used for updating sockets)



    public void addMessage(Message newMessage) {
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

    public void setClient(Client client) {
        this.client = client;
    }

    public void setDeveloper(Developer developer) {
        this.developer = developer;
    }


    public String getName1() {
        return name1;
    }

    public String getName2() {
        return name2;
    }

    public void setName1(String name1) {
        this.name1 = name1;
    }

    public void setName2(String name2) {
        this.name2 = name2;
    }
}
