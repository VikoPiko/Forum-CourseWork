package com.mse.edu.forum.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.nio.charset.StandardCharsets;

@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(String secret, long expirationMs) {
	public JwtProperties {
		if (secret == null || secret.isBlank()) {
			throw new IllegalArgumentException("app.jwt.secret must be set");
		}
        if(secret.getBytes(StandardCharsets.UTF_8).length < 32){
            throw new IllegalArgumentException(("app.jwt.secret must be at least 32 characters long"));
        }
	}
}
