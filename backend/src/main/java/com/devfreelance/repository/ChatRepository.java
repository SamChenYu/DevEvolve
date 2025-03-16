package com.devfreelance.repository;


import com.devfreelance.models.Chat;
import com.devfreelance.models.Client;
import com.devfreelance.models.Developer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, String> {

    // Finding chat by client and developer
    Chat findByClientAndDeveloper(@Param("client") Client client, @Param("developer") Developer developer);

    // Finding chat by developer
    List<Chat> findByDeveloper(Developer developer);

    List<Chat> findByClient(Client client);
}
