package com.devfreelance.controller;


import com.devfreelance.models.Chat;
import com.devfreelance.models.Client;
import com.devfreelance.models.Developer;
import com.devfreelance.models.Message;
import com.devfreelance.repository.ClientRepository;
import com.devfreelance.repository.DeveloperRepository;
import com.devfreelance.request.ChatRequest;
import com.devfreelance.request.MessageSendRequest;
import com.devfreelance.request.MessageUpdateRequest;
import com.devfreelance.service.MessagingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping("/chat")
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
    public ResponseEntity<Chat> getChat(@RequestBody ChatRequest chatRequest) {
        String clientID = chatRequest.getClientID();
        String developerID = chatRequest.getDeveloperID();
        // String inputs because the frontend will not know the IDs of both client and developer
        if(clientID == null || developerID == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        Optional<Client> clientObj = clientRepository.findById(Integer.parseInt(clientID));
        Optional<Developer> developerObj = developerRepository.findById(Integer.parseInt(developerID));
        if(clientObj.isEmpty() || developerObj.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        // Todo: web socket updates

        Chat chat = messagingService.getChat(clientObj.get(), developerObj.get());
        return ResponseEntity.ok(chat);
    }


    @GetMapping("/getall/{userID}")
    public ResponseEntity<List<Chat>> getAllChats(@PathVariable String userID) {
        System.out.println("/chat/getall/{userID} UserID: " + userID);
        if(userID == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        List<Chat> chats = new ArrayList<>();

        // Assume name is a developer
        Optional<Developer> developerObj = developerRepository.findById(Integer.parseInt(userID));
        if(developerObj.isPresent()) {
            List<Client> clients = messagingService.getClientChats(developerObj.get());
            for(Client client : clients) {
                chats.add(messagingService.getChat(client, developerObj.get()));
            }
            return ResponseEntity.ok(chats);
        }

        // Assume name is a client
        Optional<Client> clientObj = clientRepository.findById(Integer.parseInt(userID));
        if(clientObj.isPresent()) {
            List<Developer> developers = messagingService.getDeveloperChats(clientObj.get());
            for(Developer developer : developers) {
                chats.add(messagingService.getChat(clientObj.get(), developer));
            }
            return ResponseEntity.ok(chats);
        }
        // If name is neither a client nor a developer
        System.out.println("Error: ChatController /getall: Email not found");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @GetMapping("/messageUpdate")
    public ResponseEntity<List<Message>> getMessages(@RequestBody MessageUpdateRequest messageUpdateRequest) {
        // Frontend has the last messageID, so it can request for new messages
        String chatID = messageUpdateRequest.getChatID();
        int messageIDRequest = messageUpdateRequest.getMessageID();
        if(chatID == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        Chat chat = messagingService.getChat(chatID);
        if(chat == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        // Return only the messages that are newer than the last messageID
        List<Message> messages = chat.getMessages();
        List<Message> newMessages = new ArrayList<>();
        for(Message message : messages) {
            System.out.println("MessageID: " + message.getMessageID() + " MessageIDRequest: " + messageIDRequest);
            if(message.getMessageID() >= messageIDRequest) {
                newMessages.add(message);
            }
        }
        return ResponseEntity.ok(newMessages);
    }

    @PostMapping("/send")
    public ResponseEntity<Void> sendMessage(@RequestBody MessageSendRequest messageSendRequest) {
        //System.out.println("Controller level" + message.getChatID() + " " + message.getMessageID());
        boolean success = messagingService.sendMessage(messageSendRequest);
        if(!success) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        String destination = "/topic/chat/" + messageSendRequest.getChatID();
        simpMessagingTemplate.convertAndSend(destination, "Incoming Message"); // Sends a notification to the socket
        System.out.println("Message send for chatID: " + messageSendRequest.getChatID() + " messageID: " + messageSendRequest.getMessageID() + " at " + destination);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/new")
    public ResponseEntity<Chat> newChat(@RequestBody ChatRequest chatRequest) {
        // Used for when auto generated after project match
        String clientID = chatRequest.getClientID();
        String developerID = chatRequest.getDeveloperID();
        // String inputs because the frontend will not know the IDs of both client and developer
        if(clientID == null || developerID == null) {
            System.out.println("RequestBody is null");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        Optional<Client> clientObj = clientRepository.findById(Integer.parseInt(clientID));
        Optional<Developer> developerObj = developerRepository.findById(Integer.parseInt(developerID));
        if(clientObj.isEmpty() || developerObj.isEmpty()) {
            System.out.println("Client or Developer not found");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        //Todo: web socket updates
        Chat chat = messagingService.getChat(clientObj.get(), developerObj.get());
        return ResponseEntity.ok(chat);
    }

    @PostMapping("/search")
    public List<Object> searchUser(@RequestBody ChatRequest chatRequest) {
        String query = chatRequest.getSearchRequest();
        boolean isClient = chatRequest.getIsClient();
        System.out.println("Search query: " + query);
        List<Object> users = new ArrayList<>();
        if(isClient) {
            users.addAll(developerRepository.searchUser(query));
        } else {
            users.addAll(clientRepository.searchUser(query));
        }
        return users;
    }

    @DeleteMapping("/delete/{chatID}")
    public ResponseEntity<Void> deleteChat(@PathVariable String chatID) {
        boolean status = messagingService.clearAllMessages(chatID);
        if(!status) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        String destination = "/topic/chat/" + chatID;
        simpMessagingTemplate.convertAndSend(destination, "Deleted"); // Sends a notification to the socket
        System.out.println("Chat logs cleared for " + chatID + " at " + destination);
        return ResponseEntity.ok().build();
    }




}
