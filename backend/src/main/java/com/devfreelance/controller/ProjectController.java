package com.devfreelance.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devfreelance.models.BidStatus;
import com.devfreelance.models.Bids;
import com.devfreelance.models.Client;
import com.devfreelance.models.Developer;
import com.devfreelance.models.ProjectStatus;
import com.devfreelance.models.Projects;
import com.devfreelance.models.Ratings;
import com.devfreelance.repository.BidRepository;
import com.devfreelance.repository.ClientRepository;
import com.devfreelance.repository.DeveloperRepository;
import com.devfreelance.repository.ProjectRepository;
import com.devfreelance.repository.RatingRepository;
import com.devfreelance.response.BidResponse;
import com.devfreelance.response.ProjectResponse;
import org.springframework.web.bind.annotation.RequestParam;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth/projects")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ClientRepository clientRepository; 

    @Autowired
    private DeveloperRepository developerRepository; 

    @Autowired
    private BidRepository bidRepository;
    
    @Autowired
    private RatingRepository ratingRepository;
    
    @GetMapping("/client/{clientId}")
    public List<Projects> getProjectsByClient(@PathVariable("clientId") Integer clientId) throws Exception {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new Exception("Client not found."));
        List<Projects> projects = projectRepository.findByClientId(clientId);
        
        //System.out.println("Projects found: " + projects.size()); // Debugging
        return projects;
    }

    @GetMapping("/developer/{developerId}")
    public List<Projects> getProjectsByDeveloper(@PathVariable("developerId") Integer developerId) throws Exception {
        Developer developer = developerRepository.findById(developerId)
                .orElseThrow(() -> new Exception("Developer not found."));
        
        return projectRepository.findByDeveloperId(developerId);
    }

    
    @GetMapping("/{projectId}")
    public ProjectResponse getProjectDetails(@PathVariable("projectId") Integer projectId) throws Exception {
        Projects project = projectRepository.findById(projectId)
                .orElseThrow(() -> new Exception("Project not found"));

        return new ProjectResponse(project);
    }

    @GetMapping("/rating/{projectId}")
    public Ratings getProjectRating(@PathVariable Integer projectId) {
        return ratingRepository.findByProjectId(projectId).orElse(null);
    }
    
    @GetMapping("/client/{clientId}/{projectId}")
    public Projects getProject(@PathVariable("clientId") Integer clientId, @PathVariable("projectId") Integer projectId) throws Exception {
    	Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new Exception("Client not found."));
    	List<Projects> projects = projectRepository.findByClientId(clientId);
    	for (int i = 0; i < projects.size(); i++) {
    		if(projects.get(i).getId() == projectId) {
    			//System.out.println(projects.get(i));
    			return projects.get(i);
    		}
    	}
    	return null;
    }
    
    @GetMapping("/all")
    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(ProjectResponse::new)
                .toList();
    }

    @GetMapping("/search")
    public List<ProjectResponse> searchProjects(@RequestParam String query) {

        return projectRepository.searchProject(query).stream()
                .map(ProjectResponse::new)
                .toList();
        
    }
    

    @PostMapping("/create/{clientId}")
    public Projects createProject(@PathVariable("clientId") Integer clientId, @RequestBody Projects project) throws Exception {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new Exception("Client not found."));

        if (client.getCoins() < project.getCost()) {
            throw new Exception("Not enough coins to post project.");
        }
        
        
        
        Projects newProject = new Projects();
        newProject.setTitle(project.getTitle());
        newProject.setDescription(project.getDescription());
        newProject.setRepoLink(project.getRepoLink());
        newProject.setCost(project.getCost());
        newProject.setClient(client);
        
        if (project.getImageUrl() != null) {
            newProject.setImageUrl(project.getImageUrl());
        }

        client.setCoins(client.getCoins() - project.getCost());
       
        return projectRepository.save(newProject);
    }

    @PutMapping("/hire/{projectId}/{bidId}")
    public String hireDeveloper(@PathVariable Integer projectId, @PathVariable Integer bidId) throws Exception {
        Projects project = projectRepository.findById(projectId)
                .orElseThrow(() -> new Exception("Project not found."));

        Bids bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new Exception("Bid not found."));

        Developer developer = bid.getDeveloper(); 
        Client client = project.getClient();

        if (client.getCoins() < bid.getAmount()) {
            throw new Exception("Client does not have enough coins.");
        }


        client.setCoins(client.getCoins() - bid.getAmount());

        project.setDeveloper(developer);
        project.setStatus(ProjectStatus.IN_PROGRESS);
        bid.setStatus(BidStatus.ACCEPTED);

        for (Bids otherBid : project.getBids()) {
            if (!otherBid.getId().equals(bidId)) {
                otherBid.setStatus(BidStatus.REJECTED);
                bidRepository.save(otherBid); 
            }
        }

        projectRepository.save(project);
        bidRepository.save(bid);
        clientRepository.save(client);

        return "Developer hired successfully.";
    }

    @PutMapping("/complete/{projectId}")
    public Projects developerCompletesProject(@PathVariable Integer projectId, @RequestBody String report) throws Exception {
        Projects project = projectRepository.findById(projectId)
                .orElseThrow(() -> new Exception("Project not found."));

        if (project.getDeveloper() == null) {
            throw new Exception("No developer worked on this project.");
        }

        project.setStatus(ProjectStatus.COMPLETED);
        project.setFinalReport(report);
        projectRepository.save(project);

        return project;
    }

    @PutMapping("/archive/{projectId}")
    public Projects archiveProject(@PathVariable Integer projectId) throws Exception {
        Projects project = projectRepository.findById(projectId)
                .orElseThrow(() -> new Exception("Project not found."));

        project.setStatus(ProjectStatus.ARCHIVED);
        projectRepository.save(project);

        return project;
    }

    @PutMapping("/rate/{projectId}")
    public String rateDeveloper(@PathVariable Integer projectId, @RequestBody Ratings ratings) throws Exception {
        Projects project = projectRepository.findById(projectId)
                .orElseThrow(() -> new Exception("Project not found."));

        if (project.getDeveloper() == null) {
            throw new Exception("No developer worked on this project.");
        }

        Developer developer = project.getDeveloper();
        int rating = ratings.getRatingOutOfFive();  // Assuming one developer per project in this context
        
        Bids bid = bidRepository.findByProjectIdAndDeveloperId(projectId, developer.getId());
        int totalPayment = (int) (bid.getAmount() * (rating / 5.0));


        developer.setCoins(developer.getCoins() + totalPayment);
        developer.setCoinsEarnedAllTime(developer.getCoinsEarnedAllTime() + totalPayment);
        developer.updateLevel();
        developer.getCompletedProjects().add(project);
        
        
        Ratings devRating = new Ratings();
        devRating.setDeveloper(developer);
        devRating.setProject(project);
        devRating.setRatingOutOfFive(rating);
        devRating.setFeedback(ratings.getFeedback());
        developer.getRatings().add(devRating);
        developerRepository.save(developer);
        

        

        return "Developer rated successfully.";
    }
}


