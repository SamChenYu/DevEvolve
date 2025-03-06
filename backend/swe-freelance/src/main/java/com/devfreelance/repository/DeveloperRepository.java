package com.devfreelance.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.devfreelance.models.Developer;
import com.devfreelance.models.Projects;

@Repository
public interface DeveloperRepository extends JpaRepository<Developer, Integer> {
	Optional<Developer> findByEmail(String email);
	@Query("SELECT d FROM Developer d WHERE LOWER(d.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.lastName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Developer> searchUser(@Param("query") String query);
}
