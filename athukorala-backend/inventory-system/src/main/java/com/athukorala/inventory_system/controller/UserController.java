package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.User;
import com.athukorala.inventory_system.entity.Role; // IMPORT YOUR ROLE ENUM
import com.athukorala.inventory_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    // Constructor injection resolves the "Field injection is not recommended" warning
    @Autowired
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/customers")
    public List<User> getAllCustomers() {
        // Updated to compare using the Enum name
        return userRepository.findAll().stream()
                .filter(user -> "CUSTOMER".equals(user.getRole().name()))
                .collect(Collectors.toList());
    }

    @PatchMapping("/{id}/role")
    public User updateRole(@PathVariable Long id, @RequestBody String newRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Remove quotes and convert the String to your Role Enum
        String cleanedRole = newRole.replace("\"", "").toUpperCase();

        // This converts the String "STAFF" or "ADMIN" into the Role Enum type
        user.setRole(Role.valueOf(cleanedRole));

        return userRepository.save(user);
    }
}