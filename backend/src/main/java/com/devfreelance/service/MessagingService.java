package com.devfreelance.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MessagingService {

    //@Autowired
    //private MessagingRepository messagingRepository;

    public void addUser(String sessionId, String username) {
        System.out.println("Adding user: " + username + " with session id: " + sessionId);
    }

}
