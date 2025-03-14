package com.devfreelance.repository;


import com.devfreelance.models.Message;
import com.devfreelance.models.MessagesID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, MessagesID> {
}
