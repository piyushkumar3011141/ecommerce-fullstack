package com.ecommerce.ecommercebackend.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ecommerce.ecommercebackend.entity.User;
import com.ecommerce.ecommercebackend.repository.UserRepository;

/**
 * JWT token se pata karta hai ki request kaun sa user bhej raha hai.
 * Isse koi user dusre user ka cart / orders / address nahi dekh sakta.
 */
@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User requireUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getName() == null || "anonymousUser".equals(auth.getName())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please login first");
        }

        try {
            return userRepository.findById(Long.parseLong(auth.getName()))
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.UNAUTHORIZED, "User not found. Please login again"));
        } catch (NumberFormatException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token. Please login again");
        }
    }

    // Sirf ADMIN ke liye (role database se check hota hai, token par bharosa nahi)
    public User requireAdmin() {
        User user = requireUser();

        if (!user.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
        }
        return user;
    }
}
