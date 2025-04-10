package com.devfreelance.config;

import com.devfreelance.models.*;
import com.devfreelance.repository.*;
import com.devfreelance.request.MessageSendRequest;
import com.devfreelance.service.MessagingService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Configuration
public class DataSeedConfig {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private DeveloperRepository developerRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MessagingService messagingService;

    @Bean
    public CommandLineRunner dataSeed() {
        return args -> {
            if (clientRepository.count() == 0 && developerRepository.count() == 0) {
                Client client = new Client();
                client.setFirstName("Andreas");
                client.setLastName("Mantzoukis");
                client.setEmail("andreas@gmail.com");
                client.setImageUrl("https://res.cloudinary.com/dmavzy5eg/image/upload/v1743698008/fh1falkno6uciyb5lq5r.jpg");
                client.setPassword(passwordEncoder.encode("password"));
                client.setCoins(1000);
                clientRepository.save(client);

                Projects project = new Projects();
                project.setTitle("QMUL Issues");
                project.setImageUrl("https://res.cloudinary.com/dmavzy5eg/image/upload/v1743702239/b2nzxkgmthmlil3fn8gu.jpg");
                project.setDescription("Fix the issues with the QMUL website");
                project.setClient(client);
                projectRepository.save(project);

                client = new Client();
                client.setFirstName("Dominik");
                client.setLastName("Chmielewski");
                client.setEmail("dom@gmail.com");
                client.setImageUrl("https://res.cloudinary.com/dmavzy5eg/image/upload/v1743696858/itkrf7uigbw4c0lvbmvr.webp");

                client.setPassword(passwordEncoder.encode("password"));
                client.setCoins(1000);
                clientRepository.save(client);

                project = new Projects();
                project.setTitle("Crypto App");
                project.setImageUrl("https://res.cloudinary.com/dmavzy5eg/image/upload/v1743702296/fwko4fykb6npllowabhd.webp");
                project.setDescription("Create a new crypto app");
                project.setClient(client);
                projectRepository.save(project);


                client = new Client();
                client.setFirstName("Enrico");
                client.setLastName("Guo");
                client.setEmail("enrico@gmail.com");
                client.setPassword(passwordEncoder.encode("password"));
                client.setCoins(1000);
                clientRepository.save(client);

                project = new Projects();
                project.setTitle("E-commerce Website");
                project.setImageUrl("https://res.cloudinary.com/dmavzy5eg/image/upload/v1743702386/cpntzczegppadlsaowmd.jpg");
                project.setDescription("Create a new e-commerce website");
                project.setClient(client);
                projectRepository.save(project);

                Developer developer = new Developer();
                developer.setFirstName("Sam Chen");
                developer.setLastName("Yu");
                developer.setEmail("Sam@gmail.com");
                developer.setImageUrl("https://res.cloudinary.com/dmavzy5eg/image/upload/v1743798769/cfmovwn1jbz2yuyt8lkj.jpg");
                developer.setPassword(passwordEncoder.encode("password"));
                developer.setCoins(1000);
                developerRepository.save(developer);

                Developer sam = developerRepository.findByEmail("Sam@gmail.com").get();
                project = projectRepository.findById(1).get();
                project.setDeveloper(sam);
                project.setStatus(ProjectStatus.IN_PROGRESS);
                projectRepository.save(project);

                developer = new Developer();
                developer.setFirstName("Vishva");
                developer.setLastName("Mehta");
                developer.setEmail("vishva@gmail.com");
                developer.setPassword(passwordEncoder.encode("password"));
                developer.setCoins(1000);
                developerRepository.save(developer);

                Developer vishva = developerRepository.findByEmail("vishva@gmail.com").get();
                project = projectRepository.findById(2).get();

                Bids bid = new Bids();
                bid.setDeveloper(vishva);
                bid.setProject(project);
                bid.setAmount(100);
                bidRepository.save(bid);

                developer = new Developer();
                developer.setFirstName("Wahida");
                developer.setLastName("Rahman");
                developer.setEmail("wahida@gmail.com");
                developer.setPassword(passwordEncoder.encode("password"));
                developer.setCoins(1000);
                developerRepository.save(developer);

                Developer wahida = developerRepository.findByEmail("wahida@gmail.com").get();
                project = projectRepository.findById(2).get();

                bid = new Bids();
                bid.setDeveloper(wahida);
                bid.setProject(project);
                bid.setAmount(200);
                bidRepository.save(bid);


                //Setup chat between client and developer
                Client andreas = clientRepository.findByEmail("andreas@gmail.com").get();
                Chat chat = new Chat();
                chat.setClient(andreas);
                chat.setDeveloper(wahida);
                chat.setName1(andreas.getFirstName() + " " + andreas.getLastName());
                chat.setName2(wahida.getFirstName() + " " + wahida.getLastName());
                chatRepository.save(chat);


                Admin admin = new Admin();
                admin.setEmail("admin@gmail.com");
                admin.setPassword(passwordEncoder.encode("password"));
                adminRepository.save(admin);


            }


        };
    }
}
