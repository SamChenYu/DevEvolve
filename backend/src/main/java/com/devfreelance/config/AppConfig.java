package com.devfreelance.config;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import jakarta.servlet.http.HttpServletRequest;


@Configuration
@EnableWebSecurity
public class AppConfig {


	@Value("${host.ip}")
	private String hostIP;
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.sessionManagement(
        		management -> management.sessionCreationPolicy(
        				SessionCreationPolicy.STATELESS)).authorizeHttpRequests(
                Authorize -> Authorize.requestMatchers("/auth/**").authenticated()
                        .anyRequest().permitAll()
        )
                .addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class)
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()));
		
		
		return http.build();
	}

	private CorsConfigurationSource corsConfigurationSource() {
	    return new CorsConfigurationSource() {
	        @Override
	        public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
	            CorsConfiguration config = new CorsConfiguration();
	            // Remove the trailing slash
				String origin = "http://" + hostIP + ":3000";
				//System.out.println("Origin: " + origin);
	            config.setAllowedOrigins(Arrays.asList(origin));
	            config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
	            config.setAllowCredentials(true);
	            config.setAllowedHeaders(Arrays.asList(
	                "Origin",
	                "Content-Type",
	                "Accept",
	                "Authorization",
	                "Access-Control-Allow-Origin",
	                "Access-Control-Request-Method",
	                "Access-Control-Request-Headers"
	            ));
	            config.setExposedHeaders(Arrays.asList("Authorization"));
	            config.setMaxAge(3600L);
	            return config;
	        }
	    };
	}
}
