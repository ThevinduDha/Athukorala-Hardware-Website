package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.User;
import com.athukorala.inventory_system.entity.Role;
import com.athukorala.inventory_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    @Autowired
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // --- NEW: PERSONNEL REGISTRY PROTOCOL ---
    // Pulls every user regardless of role for the Management Command Center
    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/customers")
    public List<User> getAllCustomers() {
        return userRepository.findAll().stream()
                .filter(user -> "CUSTOMER".equals(user.getRole().name()))
                .collect(Collectors.toList());
    }

    // --- UPDATED: ACCESS TIER MODIFICATION ---
    // Optimized to handle JSON objects from the PersonnelRegistry React component
    @PatchMapping("/{id}/change-role")
    public ResponseEntity<User> updateRole(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Target Personnel not found in Registry"));

        String newRoleStr = payload.get("role").toUpperCase();
        user.setRole(Role.valueOf(newRoleStr));

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }

    // --- PROFILE UPDATE PROTOCOL ---
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody User profileData) {
        return userRepository.findById(id).map(existingUser -> {

            // Update Name
            if (profileData.getName() != null && !profileData.getName().isEmpty()) {
                existingUser.setName(profileData.getName());
            }

            // Update Phone
            if (profileData.getPhone() != null && !profileData.getPhone().isEmpty()) {
                existingUser.setPhone(profileData.getPhone());
            }

            // Update Address
            if (profileData.getAddress() != null && !profileData.getAddress().isEmpty()) {
                existingUser.setAddress(profileData.getAddress());
            }

            // Update Profile Picture
            if (profileData.getProfilePic() != null) {
                existingUser.setProfilePic(profileData.getProfilePic());
            }

            userRepository.save(existingUser);
            return ResponseEntity.ok(existingUser);

        }).orElse(ResponseEntity.notFound().build());
    }
}