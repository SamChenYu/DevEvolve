package com.devfreelance.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.devfreelance.models.Client;
import com.devfreelance.models.Developer;
import com.devfreelance.repository.ClientRepository;
import com.devfreelance.repository.DeveloperRepository;


@Service
public class UserDetailService implements UserDetailsService {

	@Autowired
    private ClientRepository clientRepository;

    @Autowired
    private DeveloperRepository developerRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Client> client = clientRepository.findByEmail(username);
        if (client.isPresent()) {
            return new org.springframework.security.core.userdetails.User(client.get().getEmail(), client.get().getPassword(), new ArrayList<>());
        }

        Optional<Developer> developer = developerRepository.findByEmail(username);
        if (developer.isPresent()) {
            return new org.springframework.security.core.userdetails.User(developer.get().getEmail(), developer.get().getPassword(), new ArrayList<>());
        }

        throw new UsernameNotFoundException("User not found with email: " + username);
    }

}
