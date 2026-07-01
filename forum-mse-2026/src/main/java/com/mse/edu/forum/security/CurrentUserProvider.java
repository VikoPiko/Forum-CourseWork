package com.mse.edu.forum.security;

import com.mse.edu.forum.domain.UserEntity;
import com.mse.edu.forum.repo.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.net.Authenticator;

@Component
public class CurrentUserProvider {
    private final UserRepository userRepository;

    public CurrentUserProvider(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public ForumUserDetails getCurrentUserDetails(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof  ForumUserDetails details)) {
            throw new AuthenticationCredentialsNotFoundException("Authentication Failed");
        }
        return details;
    }

    public Long getCurrentUserId() {return getCurrentUserDetails().getId();}

    public UserEntity getCurrentUserEntity(){
        Long id = getCurrentUserId();
        return userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }
}
