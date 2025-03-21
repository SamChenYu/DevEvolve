package com.devfreelance.service;

import com.devfreelance.models.Chat;
import com.devfreelance.models.Client;
import com.devfreelance.models.Developer;
import com.devfreelance.models.Message;
import com.devfreelance.repository.ChatRepository;
import com.devfreelance.repository.ClientRepository;
import com.devfreelance.repository.DeveloperRepository;
import com.devfreelance.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.devfreelance.request.MessageSendRequest;

import java.util.ArrayList;
import java.util.List;

@Service
public class MessagingService {

    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private DeveloperRepository developerRepository;
    @Autowired
    private ClientRepository clientRepository;

    public Chat getChat(Client client, Developer developer) {
        if(client == null || developer == null) return null;

        //Check that the client and developer exist
        if(!clientRepository.existsById(client.getId()) || !developerRepository.existsById(developer.getId())) return null;

        // Fetch chat if it exists
        Chat chat = chatRepository.findByClientAndDeveloper(client, developer);

        if(chat != null) {
            return chat;
        } else {
            Chat newChat = new Chat(client, developer);
            newChat.setName1(client.getFirstName() + " " + client.getLastName());
            newChat.setName2(developer.getFirstName() + " " + developer.getLastName());
            chatRepository.save(newChat);
            return newChat;
        }
    }


    public List<Client> getClientChats(Developer developer) {
        // Developer querying all their chats with other clients
        List<Chat> chats = chatRepository.findByDeveloper(developer);
        List<Client> clients = new ArrayList<>();

        for(Chat chat : chats) {
            clients.add(chat.getClient());
        }
        return clients;
    }

    public List<Developer> getDeveloperChats(Client client) {
        //Client querying all their chats with other developers
        List<Chat> chats = chatRepository.findByClient(client);
        List<Developer> developers = new ArrayList<>();

        for(Chat chat : chats) {
            developers.add(chat.getDeveloper());
        }
        return developers;
    }

    public boolean sendMessage(MessageSendRequest messageSendRequest) {
        // return -> success or failure
        if(messageSendRequest.getChatID() == null) {
            System.out.println("Error MessagingService /sendMessage: ChatID is null");
            return false;
        }
        String chatID = messageSendRequest.getChatID();
        Chat chat = chatRepository.findById(chatID).orElse(null);
        if(chat == null) {
            System.out.println("Error MessagingService /sendMessage: Chat not found");
            return false;
        }

        int currentMessageID = chat.getCurrentMessageID();
        messageSendRequest.setMessageID(currentMessageID);
        Message message = messageSendRequest.toMessage();
        chat.addMessage(message);
        message.setChat(chat);
        chatRepository.save(chat);
        return true;
    }



    public List<Message> getMessagesSince(String chatID, int messageID) {
        if(chatID == null) return null;
        Chat chat = chatRepository.findById(chatID).orElse(null);
        List<Message> messages = chat.getMessages();
        List<Message> messagesSince = new ArrayList<>();
        for(int i=messageID+1; i<messages.size(); i++) {
            messagesSince.add(messages.get(i));
        }
        return messagesSince;
    }

    public Chat getChat(String chatID) {
        return chatRepository.findById(chatID).orElse(null);
    }






}
