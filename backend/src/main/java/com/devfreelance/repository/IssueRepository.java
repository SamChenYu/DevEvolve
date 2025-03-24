package com.devfreelance.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.devfreelance.models.Issues;

public interface IssueRepository extends JpaRepository<Issues, Integer> {
    // List<Issues> findByClientId(Integer clientId);
    // List<Issues> findByDeveloperId(Integer developerId);

    @Query("SELECT i FROM Issues i WHERE LOWER(i.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(i.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Issues> searchIssue(@Param("query") String query);
    
}
