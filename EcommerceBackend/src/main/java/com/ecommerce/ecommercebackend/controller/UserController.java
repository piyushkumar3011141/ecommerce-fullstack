package com.ecommerce.ecommercebackend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.ecommerce.ecommercebackend.dto.LoginResponse;
import com.ecommerce.ecommercebackend.dto.UserResponse;
import com.ecommerce.ecommercebackend.entity.User;
import com.ecommerce.ecommercebackend.repository.UserRepository;
import com.ecommerce.ecommercebackend.service.CurrentUserService;
import com.ecommerce.ecommercebackend.service.JwtService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final int MIN_PASSWORD_LENGTH = 6;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CurrentUserService currentUserService;

    public UserController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            CurrentUserService currentUserService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.currentUserService = currentUserService;
    }

    // =========================
    // SIGNUP  (public)
    // =========================

    @PostMapping("/signup")
    public ResponseEntity<LoginResponse> signup(@RequestBody User request) {

        String name = request.getName() == null ? "" : request.getName().trim();
        String email = request.getEmail() == null ? "" : request.getEmail().trim();
        String password = request.getPassword() == null ? "" : request.getPassword();

        if (name.isEmpty() || email.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name and email are required");
        }

        if (password.length() < MIN_PASSWORD_LENGTH) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Password must be at least " + MIN_PASSWORD_LENGTH + " characters");
        }

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This email is already registered");
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("USER");   // role client se kabhi nahi aata

        User saved = userRepository.save(user);

        // Signup ke baad seedha login: token bhi do
        return ResponseEntity.status(HttpStatus.CREATED).body(toLoginResponse(saved));
    }

    // =========================
    // LOGIN  (public)
    // =========================

    @PostMapping("/login")
    public LoginResponse login(@RequestBody User request) {

        if (request.getEmail() == null || request.getPassword() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        List<User> candidates = userRepository.findAllByEmailIgnoreCase(request.getEmail().trim());

        for (User candidate : candidates) {
            if (candidate.getPassword() != null
                    && passwordEncoder.matches(request.getPassword(), candidate.getPassword())) {
                return toLoginResponse(candidate);
            }
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    // =========================
    // CURRENT USER
    // =========================

    @GetMapping("/me")
    public UserResponse me() {
        return UserResponse.fromUser(currentUserService.requireUser());
    }

    // =========================
    // UPDATE PROFILE  (sirf apna)
    // =========================

    @PutMapping("/{id}")
    public UserResponse updateUser(@PathVariable Long id, @RequestBody User request) {

        User current = currentUserService.requireUser();

        if (!current.getId().equals(id)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only edit your own profile");
        }

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            current.setName(request.getName().trim());
        }

        // Phone khali bhej sakte hain (hatane ke liye)
        if (request.getPhone() != null) {
            current.setPhone(request.getPhone().trim());
        }

        // Password sirf tab badlo jab naya diya ho
        if (request.getPassword() != null && !request.getPassword().isBlank()) {

            if (request.getPassword().length() < MIN_PASSWORD_LENGTH) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Password must be at least " + MIN_PASSWORD_LENGTH + " characters");
            }

            current.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return UserResponse.fromUser(userRepository.save(current));
    }

    private LoginResponse toLoginResponse(User user) {
        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.isAdmin() ? "ADMIN" : "USER",
                jwtService.generateToken(user.getId(), user.getEmail(), user.isAdmin() ? "ADMIN" : "USER"));
    }
}
