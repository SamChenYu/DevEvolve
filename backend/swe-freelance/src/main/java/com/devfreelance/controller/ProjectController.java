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

import com.devfreelance.models.Bids;
import com.devfreelance.models.Client;
import com.devfreelance.models.Developer;
import com.devfreelance.models.Projects;
import com.devfreelance.models.Ratings;
import com.devfreelance.repository.BidRepository;
import com.devfreelance.repository.ClientRepository;
import com.devfreelance.repository.DeveloperRepository;
import com.devfreelance.repository.ProjectRepository;
import com.devfreelance.repository.RatingRepository;

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
    
    @GetMapping("/{projectId}")
    public Projects getProjectDetails(@PathVariable("projectId") Integer projectId) throws Exception {
    	Projects project = projectRepository.findById(projectId).orElseThrow(() -> new Exception("Project not found,"));
    	return project;
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
    public List<Projects> getAllProjects() {
        return projectRepository.findAll();
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

        client.setCoins(client.getCoins() - project.getCost());
       
        return projectRepository.save(newProject);
    }

    @PutMapping("/hire/{projectId}/{bidId}")
    public String hireDeveloper(@PathVariable Integer projectId, @PathVariable Integer bidId) throws Exception {
        Projects project = projectRepository.findById(projectId)
                .orElseThrow(() -> new Exception("Project not found."));

        Bids bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new Exception("Bid not found."));

        Developer developer = bid.getDeveloper(); // Correctly access the developer

        Client client = project.getClient();

        if (client.getCoins() < bid.getAmount()) {
            throw new Exception("Client does not have enough coins.");
        }

        // Deduct coins from client
        client.setCoins(client.getCoins() - bid.getAmount());

        // Add developer to project
        project.setDeveloper(developer); // Assign the developer to the project
        bid.setAccepted(true);

        projectRepository.save(project);
        bidRepository.save(bid);
        clientRepository.save(client);

        return "Developer hired successfully.";
    }

    @PutMapping("/complete/{projectId}")
    public String completeProject(@PathVariable Integer projectId, @RequestBody List<Integer> ratings) throws Exception {
        Projects project = projectRepository.findById(projectId)
                .orElseThrow(() -> new Exception("Project not found."));

        if (project.getDeveloper() == null) {
            throw new Exception("No developer worked on this project.");
        }

        Developer developer = project.getDeveloper();
        int rating = ratings.get(0);  // Assuming one developer per project in this context
        int totalPayment = (int) (developer.getCoins() * (rating / 5.0));

        developer.setCoins(developer.getCoins() + totalPayment);
        developer.setCoinsEarnedAllTime(developer.getCoinsEarnedAllTime() + totalPayment);
        developer.updateLevel();
        developer.getCompletedProjects().add(project);
        developerRepository.save(developer);
        
        Ratings devRating = new Ratings();
        devRating.setDeveloper(developer);
        devRating.setRatingOutOfFive(rating);
        developer.getRatings().add(devRating);
        ratingRepository.save(devRating);

        project.setCompleted(true);
        projectRepository.save(project);

        return "Project completed and payments distributed.";
    }
}


