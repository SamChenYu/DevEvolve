package com.devfreelance.repository;


import com.devfreelance.models.Message;
import com.devfreelance.models.MessageID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, MessageID> {
}
