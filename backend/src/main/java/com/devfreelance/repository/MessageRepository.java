package com.devfreelance.repository;


import com.devfreelance.models.Message;
import com.devfreelance.models.MessageID;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageRepository extends JpaRepository<Message, MessageID> {
    @Transactional
    @Modifying
    @Query("DELETE FROM Message m WHERE m.messageID.chatID = :chatId")
    void deleteByChatId(@Param("chatId") String chatId);
}
