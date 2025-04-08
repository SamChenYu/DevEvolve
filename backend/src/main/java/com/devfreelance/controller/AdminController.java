package com.devfreelance.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devfreelance.models.Bids;
import com.devfreelance.models.Client;
import com.devfreelance.models.Developer;
import com.devfreelance.models.Projects;
import com.devfreelance.repository.BidRepository;
import com.devfreelance.repository.ClientRepository;
import com.devfreelance.repository.DeveloperRepository;
import com.devfreelance.repository.ProjectRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth/admin")
public class AdminController {
    
    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private DeveloperRepository developerRepository;

    @Autowired
    private ProjectRepository projectsRepository;

    @Autowired
    private BidRepository bidsRepository;

    @PutMapping("/modifyClient/{id}")
    public ResponseEntity<Client> modifyClient(@PathVariable Integer id, @RequestBody Client client) {
        Client entity = clientRepository.findById(id).orElse(null);
        if (entity == null) {
            return ResponseEntity.notFound().build();
        }

        if (client.getFirstName() != null) {
            entity.setFirstName(client.getFirstName());
        }

        if (client.getLastName() != null) {
            entity.setLastName(client.getLastName());
        }

        if (client.getEmail() != null) {
            entity.setEmail(client.getEmail());
        }

        if (client.getImageUrl() != null) {
            entity.setImageUrl(client.getImageUrl());
        }
        
        clientRepository.save(entity);
        return ResponseEntity.ok(entity);
    }

    @PutMapping("/incrementClientCoins/{id}/{coins}")
    public ResponseEntity<Client> updateClientCoins(@PathVariable Integer id, @PathVariable Integer coins) {
        Client entity = clientRepository.findById(id).orElse(null);
        if (entity == null) {
            return ResponseEntity.notFound().build();
        }
        int currentCoins = entity.getCoins();
        entity.setCoins(currentCoins + coins);
        clientRepository.save(entity);
        return ResponseEntity.ok(entity);
    }

    @PutMapping("/incrementDeveloperCoins/{id}/{coins}")
    public ResponseEntity<Developer> updateDeveloperCoins(@PathVariable Integer id, @PathVariable Integer coins) {
        Developer entity = developerRepository.findById(id).orElse(null);
        if (entity == null) {
            return ResponseEntity.notFound().build();
        }
        int currentCoins = entity.getCoins();
        entity.setCoins(currentCoins + coins);
        developerRepository.save(entity);
        return ResponseEntity.ok(entity);
    }

    
    @DeleteMapping("/deleteClient/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Integer id) {
        if (!clientRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        clientRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }


    @PutMapping("/modifyDeveloper/{id}")
    public ResponseEntity<Developer> modifyDeveloper(@PathVariable Integer id, @RequestBody Developer developer) {
        Developer entity = developerRepository.findById(id).orElse(null);
        if (entity == null) {
            return ResponseEntity.notFound().build();
        }

        if (developer.getFirstName() != null) {
            entity.setFirstName(developer.getFirstName());
        }

        if (developer.getLastName() != null) {
            entity.setLastName(developer.getLastName());
        }

        if (developer.getEmail() != null) {
            entity.setEmail(developer.getEmail());
        }

        if (developer.getImageUrl() != null) {
            entity.setImageUrl(developer.getImageUrl());
        }


        developerRepository.save(entity);
        return ResponseEntity.ok(entity);
    }


    @DeleteMapping("/deleteDeveloper/{id}")
    public ResponseEntity<Void> deleteDeveloper(@PathVariable Integer id) {
        if (!developerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        developerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/modifyProject/{id}")
    public ResponseEntity<Projects> modifyProject(@PathVariable Integer id, @RequestBody Projects project) {
        Projects entity = projectsRepository.findById(id).orElse(null);
        if (entity == null) {
            return ResponseEntity.notFound().build();
        }

        if (project.getTitle() != null) {
            entity.setTitle(project.getTitle());
        }

        if (project.getDescription() != null) {
            entity.setDescription(project.getDescription());
        }

        if (project.getRepoLink() != null) {
            entity.setRepoLink(project.getRepoLink());
        }

        if (project.getImageUrl() != null) {
            entity.setImageUrl(project.getImageUrl());
        }

        projectsRepository.save(entity);
        return ResponseEntity.ok(entity);
    }

    @DeleteMapping("/deleteProject/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Integer id) {
        if (!projectsRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        projectsRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/modifyBid/{id}")
    public ResponseEntity<Bids> modifyBid(@PathVariable Integer id, @RequestBody Bids bid) {
        Bids entity = bidsRepository.findById(id).orElse(null);
        if (entity == null) {
            return ResponseEntity.notFound().build();
        }

        if (bid.getAmount() != null) {
            entity.setAmount(bid.getAmount());
        }

        if (bid.getProposal() != null) {
            entity.setProposal(bid.getProposal());
        }


        bidsRepository.save(entity);
        return ResponseEntity.ok(entity);
    }

    @DeleteMapping("/deleteBid/{id}")
    public ResponseEntity<Void> deleteBid(@PathVariable Integer id) {
        if (!bidsRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bidsRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
