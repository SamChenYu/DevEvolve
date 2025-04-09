package com.devfreelance.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devfreelance.models.Issues;
import com.devfreelance.repository.IssueRepository;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/auth/issues")
public class IssueController {

    @Autowired
    private IssueRepository issueRepository;
    
    @PostMapping("/create")
    public ResponseEntity<?> createIssue(@RequestBody Issues entity) {
        
        Issues issue = new Issues();
        issue.setTitle(entity.getTitle());
        issue.setDescription(entity.getDescription());
        issue.setType(entity.getType());
        issue.setUsername(entity.getUsername());
        issue.setUserID(entity.getUserID());
        issue.setClient(entity.getClient());
        issueRepository.save(issue);
        
        return ResponseEntity.ok("Issue created successfully");
    }

    @GetMapping("/getIssue/{issueId}")
    public Issues getIssue(@PathVariable("issueId") Integer issueId) {
        Issues issue = issueRepository.findById(issueId).orElse(null);
        return issue;
    }

    @GetMapping("/all")
    public Iterable<Issues> getAllIssues() {
        return issueRepository.findAll();
    }

    @DeleteMapping("/deleteIssue/{issueId}")
    public ResponseEntity<?> deleteIssue(@PathVariable("issueId") Integer issueId) {
        issueRepository.deleteById(issueId);
        return ResponseEntity.ok("Issue deleted successfully");
    }
    
}
