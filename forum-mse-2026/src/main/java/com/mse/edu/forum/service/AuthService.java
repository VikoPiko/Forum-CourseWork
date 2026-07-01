package com.mse.edu.forum.service;

import com.mse.edu.forum.api.generated.model.LoginRequest;
import com.mse.edu.forum.api.generated.model.LoginResponse;
import com.mse.edu.forum.api.generated.model.RegisterRequest;
import com.mse.edu.forum.api.generated.model.RegisterResponse;
import com.mse.edu.forum.domain.UserEntity;
import com.mse.edu.forum.domain.UserRole;
import com.mse.edu.forum.repo.UserRepository;
import com.mse.edu.forum.security.ForumUserDetails;
import com.mse.edu.forum.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        String username = requireText(request.getUsername(), "Username");
        String password = requireText(request.getPassword(), "Password");
        if (userRepository.existsByUsernameIgnoreCase(username)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
        }
        UserEntity user = new UserEntity();
        user.setUsername(username);
        user.setRole(UserRole.USER);
        user.setPasswordHash(passwordEncoder.encode(password));
        UserEntity saved = userRepository.save(user);
        RegisterResponse response = new RegisterResponse();
        response.setId(saved.getId());
        response.setUsername(saved.getUsername());
        return response;
    }

    private static String requireText(String value, String fieldName) {
        String trimmed = value == null ? "" : value.trim();
        if (trimmed.isEmpty()) {
            throw new IllegalArgumentException(fieldName + " must not be blank");
        }
        return trimmed;
    }

    @Transactional
	public LoginResponse login(LoginRequest request) {
		var token =
				UsernamePasswordAuthenticationToken.unauthenticated(request.getUsername(), request.getPassword());
		var auth = authenticationManager.authenticate(token);
		var user = (ForumUserDetails) auth.getPrincipal();
		String jwt = jwtService.createToken(user.getId(), user.getUsername(), user.getDomainRole());
		return new LoginResponse(jwt, "Bearer", jwtService.getExpiresInSeconds());
	}
}
