package com.devfreelance.repository;

import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.devfreelance.models.Projects;

@Repository
public interface ProjectRepository extends JpaRepository<Projects, Integer> {
	List<Projects> findByClientId(Integer clientId);
    List<Projects> findByDeveloperId(Integer developerId);
}
