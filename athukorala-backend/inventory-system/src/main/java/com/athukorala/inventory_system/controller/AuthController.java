package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.dto.LoginRequest;
import com.athukorala.inventory_system.dto.UserResponseDto;
import com.athukorala.inventory_system.entity.Role;
import com.athukorala.inventory_system.entity.User;
import com.athukorala.inventory_system.repository.UserRepository;
import com.athukorala.inventory_system.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = authService.login(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
            );
            return ResponseEntity.ok(UserResponseDto.fromEntity(user));
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(401).body(response);
        }
    }

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody User user) {
        try {
            User registeredUser = authService.registerCustomer(user);
            return ResponseEntity.ok(UserResponseDto.fromEntity(registeredUser));
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    // ================= CREATE STAFF =================
    @PostMapping("/admin/create-staff")
    public ResponseEntity<?> createStaff(@RequestBody User user) {
        try {
            User staff = authService.createInternalUser(user, Role.STAFF);
            return ResponseEntity.ok(UserResponseDto.fromEntity(staff));
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    // ================= CREATE ADMIN =================
    @PostMapping("/admin/create-admin")
    public ResponseEntity<?> createAdmin(@RequestBody User user) {
        try {
            User admin = authService.createInternalUser(user, Role.ADMIN);
            return ResponseEntity.ok(UserResponseDto.fromEntity(admin));
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    // ================= FORGOT PASSWORD =================
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String token = UUID.randomUUID().toString();

            user.setResetToken(token);
            user.setTokenExpiry(LocalDateTime.now().plusMinutes(15));
            userRepository.save(user);

            String resetLink = "http://localhost:5173/reset-password?token=" + token;

            // For now just print (later we add email)
            System.out.println("RESET LINK: " + resetLink);

            return ResponseEntity.ok(Map.of("message", "Reset link sent"));

        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    // ================= RESET PASSWORD =================
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String newPassword = request.get("password");

            User user = userRepository.findByResetToken(token)
                    .orElseThrow(() -> new RuntimeException("Invalid token"));

            if (user.getTokenExpiry().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Token expired");
            }

            // FIXED: Encrypt the password before saving
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetToken(null);
            user.setTokenExpiry(null);

            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Password updated"));

        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }
}