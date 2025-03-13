package com.devfreelance.models;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chats")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Chats {

    @Id
    @Column(name = "chatID")
    private String chatID;

    @ElementCollection@CollectionTable(name="users", joinColumns=@JoinColumn(name="chatID"))
    @Column(name = "userID")
    private List<String> users = new ArrayList<>();

    @OneToMany(mappedBy = "chats", cascade = CascadeType.ALL)
    @JsonManagedReference // Manage references for JSON serialization
    private List<Messages> messages = new ArrayList<>();


    @Column(name = "currentMessageID")
    private int currentMessageID = -1; // keeps track of mesaageSize (used for updating sockets)

    public void addMessage(Messages newMessage) {
        if(messages == null) {
            messages = new ArrayList<>();
        }
        messages.add(newMessage);
    }

    public void addUser(String userID) {
        if(users == null) {
            users = new ArrayList<>();
        }
        users.add(userID);
    }


    public String getChatID() {
        return chatID;
    }

    public List<String> getUsers() {
        return users;
    }

    public List<Messages> getMessages() {
        return messages;
    }

    public int getCurrentMessageID() {
        return currentMessageID;
    }

    public void setChatID() {
       this.chatID = java.util.UUID.randomUUID().toString();
    }

    public void setUsers(List<String> users) {
        this.users = users;
    }

    public void setMessages(List<Messages> messages) {
        this.messages = messages;
    }






}
