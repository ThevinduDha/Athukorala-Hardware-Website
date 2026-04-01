package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.entity.User;
import com.athukorala.inventory_system.entity.Role;
import com.athukorala.inventory_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
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

    // --- PERSONNEL REGISTRY PROTOCOL ---
    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/customers")
    public List<User> getAllCustomers() {
        return userRepository.findAll().stream()
                .filter(user -> Role.CUSTOMER.equals(user.getRole()))
                .collect(Collectors.toList());
    }

    // --- NEW: PURGE PERSONNEL RECORD ---
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            if (!userRepository.existsById(id)) {
                return ResponseEntity.status(404).body(Map.of("message", "Target Personnel not found"));
            }
            userRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Personnel Record Purged"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Purge Failed: System Error"));
        }
    }

    // --- ACCESS TIER MODIFICATION ---
    @PatchMapping("/{id}/change-role")
    public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Target Personnel not found in Registry"));

            String newRoleStr = payload.get("role").toUpperCase();
            user.setRole(Role.valueOf(newRoleStr));

            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "ROLE MODIFICATION DENIED: " + e.getMessage());
            return ResponseEntity.status(400).body(error);
        }
    }

    // --- PROFILE UPDATE PROTOCOL ---
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody User profileData) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isPresent()) {
            User existingUser = userOptional.get();

            if (profileData.getName() != null && !profileData.getName().trim().isEmpty()) {
                existingUser.setName(profileData.getName().trim());
            }

            existingUser.setPhone(profileData.getPhone());
            existingUser.setAddress(profileData.getAddress());

            if (profileData.getProfilePic() != null) {
                existingUser.setProfilePic(profileData.getProfilePic());
            }

            User savedUser = userRepository.save(existingUser);
            return ResponseEntity.ok(savedUser);

        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "REGISTRY ERROR: USER ID " + id + " NOT FOUND");
            return ResponseEntity.status(404).body(response);
        }
    }
}