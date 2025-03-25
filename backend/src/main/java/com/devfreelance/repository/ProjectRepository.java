package com.devfreelance.repository;

import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.devfreelance.models.Projects;

@Repository
public interface ProjectRepository extends JpaRepository<Projects, Integer> {
	List<Projects> findByClientId(Integer clientId);
    List<Projects> findByDeveloperId(Integer developerId);

    @Query("SELECT p FROM Projects p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Projects> searchProject(@Param("query") String query);
}
