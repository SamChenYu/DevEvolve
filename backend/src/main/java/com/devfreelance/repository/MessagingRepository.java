package com.devfreelance.repository;


import com.devfreelance.models.Messages;
import com.devfreelance.models.MessagesID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessagingRepository extends JpaRepository<Messages, MessagesID> {
}
