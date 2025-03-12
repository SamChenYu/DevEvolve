package com.devfreelance.controller;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devfreelance.models.Bids;
import com.devfreelance.models.Developer;
import com.devfreelance.models.Projects;
import com.devfreelance.repository.BidRepository;
import com.devfreelance.repository.DeveloperRepository;
import com.devfreelance.repository.ProjectRepository;
import com.devfreelance.response.BidResponse;

@RestController
@RequestMapping("/auth/bids")
public class BidController {

	@Autowired
    private BidRepository bidRepository;

    @Autowired
    private DeveloperRepository developerRepository; 

    @Autowired
    private ProjectRepository projectRepository;

    // Place a bid
    @PostMapping("/place/{developerId}/{projectId}")
    public Bids placeBid(@PathVariable Integer developerId, @PathVariable Integer projectId, @RequestBody Bids bid) throws Exception {
        Developer developer = developerRepository.findById(developerId)
                .orElseThrow(() -> new Exception("Developer not found."));

        Projects project = projectRepository.findById(projectId)
                .orElseThrow(() -> new Exception("Project not found."));
        
        if (bid.getAmount() == null || bid.getAmount() <= 0) {
            throw new Exception("Bid amount must be greater than zero.");
        }
        
        int minBid = getMinBidByLevel(developer.getLevel());
        if (bid.getAmount() < minBid) {
            throw new Exception("Your bid amount must be at least " + minBid + " coins.");
        }

        if (project.getBids().stream().anyMatch(b -> b.getDeveloper().getId().equals(developerId))) {
            throw new Exception("You have already placed a bid for this project.");
        }

        Bids newBid = new Bids();
        newBid.setAmount(bid.getAmount());
        newBid.setDeveloper(developer); 
        newBid.setProject(project);
        newBid.setAccepted(false);
        newBid.setProposal(bid.getProposal());
        System.out.println("Current bids for the project: ");
        projectRepository.save(project);

        return bidRepository.save(newBid);
    }

    // Get bids for a project
    @GetMapping("/project/{projectId}")
    public List<BidResponse> getBidsForProject(@PathVariable Integer projectId) {
        return bidRepository.findAll().stream()
                .filter(bid -> bid.getProject().getId().equals(projectId))
                .map(BidResponse::new) 
                .collect(Collectors.toList());
    }

    // Get bids by developer
    @GetMapping("/developer/{developerId}")
    public List<BidResponse> getBidsByDeveloper(@PathVariable Integer developerId) {
        return bidRepository.findAll().stream()
                .filter(bid -> bid.getDeveloper().getId().equals(developerId))
                .map(BidResponse::new)  
                .collect(Collectors.toList());
    }

    @GetMapping("/developer-bidded/{developerId}/{projectId}")
    public Boolean hasDeveloperBidded(@PathVariable Integer developerId, @PathVariable Integer projectId) {
        return bidRepository.findAll()
                .stream()
                .anyMatch(bid -> bid.getDeveloper().getId().equals(developerId) && bid.getProject().getId().equals(projectId));
    }

    public Boolean hasDeveloperBidded(@PathVariable Integer developerId) {
        return bidRepository.findAll()
                .stream()
                .anyMatch(bid -> bid.getDeveloper().getId().equals(developerId));
    }

    // Helper function to get the minimum bid amount based on the developer's level
    @GetMapping("/min-bid/{level}")
    public int getMinBidByLevel(@PathVariable String level) {
        switch (level) {
            case "Novice":
                return 100;
            case "Intermediate":
                return 500;
            case "Advanced":
                return 2000;
            case "Expert":
                return 5000;
            default:
                return 100;
        }
    }

}
