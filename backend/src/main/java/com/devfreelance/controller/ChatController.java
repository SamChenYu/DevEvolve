package com.devfreelance.controller;


import com.devfreelance.models.Chat;
import com.devfreelance.models.Client;
import com.devfreelance.models.Developer;
import com.devfreelance.models.Message;
import com.devfreelance.repository.ClientRepository;
import com.devfreelance.repository.DeveloperRepository;
import com.devfreelance.service.MessagingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@RestController
@RequestMapping("/auth/chat")
public class ChatController {

    @Autowired
    private MessagingService messagingService;
    @Autowired
    private ClientRepository clientRepository;
    @Autowired
    private DeveloperRepository developerRepository;
    private SimpMessagingTemplate simpMessagingTemplate;

    public ChatController(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @Autowired
    public ChatController(MessagingService messagingService, SimpMessagingTemplate simpMessagingTemplate) {
        this.messagingService = messagingService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @PostMapping("/send")
    public ResponseEntity<Void> sendMessage(@RequestBody Message message) {

        boolean success = messagingService.sendMessage(message);
        if(!success) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        simpMessagingTemplate.convertAndSend("/topic/" + message.getMessageID(), "Incoming Message"); // Sends a notification to the socket
        return ResponseEntity.ok().build();
    }

    @PostMapping("/new")
    public ResponseEntity<Chat> newChat(@RequestBody String clientName, String developer) {
        // String inputs because the frontend will not know the IDs of both client and developer
        if(clientName == null || developer == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        Client clientObj = clientRepository.searchUser(clientName).get(0);
        Developer developerObj = developerRepository.searchUser(developer).get(0);
        if(clientObj == null || developerObj == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        //Todo: web socket updates

        Chat chat = messagingService.getChat(clientObj, developerObj);
        return ResponseEntity.ok(chat);
    }


    @PostMapping
    public ResponseEntity<Chat> loadChat(/*@RequestBody ChatRequest chatRequest*/) {
        // Todo
        return null;
    }
}
