package com.devfreelance.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.devfreelance.models.Client;

@Repository
public interface ClientRepository extends JpaRepository<Client, Integer> {
	Optional<Client> findByEmail(String email);
	@Query("SELECT c FROM Client c WHERE LOWER(c.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Client> searchUser(@Param("query") String query);
}
