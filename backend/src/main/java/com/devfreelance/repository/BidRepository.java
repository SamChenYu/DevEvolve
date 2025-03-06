package com.devfreelance.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

import com.devfreelance.models.Bids;

@Repository
public interface BidRepository extends JpaRepository<Bids, Integer> {
	List<Bids> findByProjectId(Integer projectId);
    List<Bids> findByDeveloperId(Integer developerId);
}
