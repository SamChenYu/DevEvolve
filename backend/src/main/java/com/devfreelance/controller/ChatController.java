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
import org.springframework.web.bind.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import java.util.List;
import java.util.ArrayList;

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

    @GetMapping("/get")
    public ResponseEntity<Chat> getChat(@RequestBody String clientName, String developerName) {
        // String inputs because the frontend will not know the IDs of both client and developer
        if(clientName == null || developerName == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        Client clientObj = clientRepository.searchUser(clientName).get(0);
        Developer developerObj = developerRepository.searchUser(developerName).get(0);
        if(clientObj == null || developerObj == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        // Todo: web socket updates

        Chat chat = messagingService.getChat(clientObj, developerObj);
        return ResponseEntity.ok(chat);
    }


    @GetMapping("/getall")
    public ResponseEntity<List<Chat>> getAllChats(@RequestBody String name) {
        if(name == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        List<Chat> chats = new ArrayList<>();

        // Assume name is a developer
        Developer developerObj = developerRepository.searchUser(name).get(0);
        if(developerObj != null) {
            List<Client> clients = messagingService.getClientChats(developerObj);
            for(Client client : clients) {
                chats.add(messagingService.getChat(client, developerObj));
            }
            return ResponseEntity.ok(chats);
        }

        // Assume name is a client
        Client clientObj = clientRepository.searchUser(name).get(0);
        if(clientObj != null) {
            List<Developer> developers = messagingService.getDeveloperChats(clientObj);
            for(Developer developer : developers) {
                chats.add(messagingService.getChat(clientObj, developer));
            }
            return ResponseEntity.ok(chats);
        }
        // If name is neither a client nor a developer
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @GetMapping("/messageUpdate")
    public ResponseEntity<List<Message>> getMessages(@RequestBody String chatID, int messageID) {
        // Frontend has the last messageID, so it can request for new messages
        if(chatID == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        Chat chat = messagingService.getChat(chatID);
        if(chat == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        List<Message> messages = chat.getMessages();
        List<Message> newMessages = new ArrayList<>();
        for(Message message : messages) {
            if(message.getMessageID() > messageID) {
                newMessages.add(message);
            }
        }
        return ResponseEntity.ok(newMessages);
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
    public ResponseEntity<Chat> newChat(@RequestBody String clientName, String developerName) {
        // String inputs because the frontend will not know the IDs of both client and developer
        if(clientName == null || developerName == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        Client clientObj = clientRepository.searchUser(clientName).get(0);
        Developer developerObj = developerRepository.searchUser(developerName).get(0);
        if(clientObj == null || developerObj == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        //Todo: web socket updates

        Chat chat = messagingService.getChat(clientObj, developerObj);
        return ResponseEntity.ok(chat);
    }



}
