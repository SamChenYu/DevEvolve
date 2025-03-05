package com.devfreelance.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.devfreelance.models.Ratings;

@Repository
public interface RatingRepository extends JpaRepository<Ratings, Integer> {
	List<Ratings> findByDeveloperId(Integer developerId);
}
