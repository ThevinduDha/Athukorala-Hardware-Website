package com.athukorala.inventory_system.controller;

import com.athukorala.inventory_system.dto.ChangePasswordRequest;
import com.athukorala.inventory_system.dto.ProfileUpdateRequest;
import com.athukorala.inventory_system.dto.UserResponseDto;
import com.athukorala.inventory_system.entity.Role;
import com.athukorala.inventory_system.entity.User;
import com.athukorala.inventory_system.repository.UserRepository;
import com.athukorala.inventory_system.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;
    private final AuthService authService;

    @Autowired
    public UserController(UserRepository userRepository, AuthService authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    @GetMapping("/all")
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/customers")
    public List<UserResponseDto> getAllCustomers() {
        return userRepository.findAll().stream()
                .filter(user -> Role.CUSTOMER.equals(user.getRole()))
                .map(UserResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok(UserResponseDto.fromEntity(user)))
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("message", "USER NOT FOUND")));
    }

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

    @PatchMapping("/{id}/change-role")
    public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Target Personnel not found in Registry"));

            String roleValue = payload.get("role");
            if (roleValue == null || roleValue.isBlank()) {
                throw new RuntimeException("ROLE VALUE IS REQUIRED");
            }

            user.setRole(Role.valueOf(roleValue.toUpperCase()));
            User updatedUser = userRepository.save(user);

            return ResponseEntity.ok(UserResponseDto.fromEntity(updatedUser));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "ROLE MODIFICATION DENIED: " + e.getMessage());
            return ResponseEntity.status(400).body(error);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody ProfileUpdateRequest profileData) {
        try {
            User existingUser = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("REGISTRY ERROR: USER ID " + id + " NOT FOUND"));

            if (profileData.getName() != null && !profileData.getName().trim().isEmpty()) {
                existingUser.setName(profileData.getName().trim());
            }

            existingUser.setPhone(profileData.getPhone());
            existingUser.setAddress(profileData.getAddress());

            // This supports upload, replace, and delete
            // If frontend sends null or "" it will remove the image
            if (profileData.getProfilePic() == null || profileData.getProfilePic().trim().isEmpty()) {
                existingUser.setProfilePic(null);
            } else {
                existingUser.setProfilePic(profileData.getProfilePic().trim());
            }

            User savedUser = userRepository.save(existingUser);
            return ResponseEntity.ok(UserResponseDto.fromEntity(savedUser));

        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "PROFILE UPDATE FAILED");
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(@PathVariable Long id,
                                            @RequestBody ChangePasswordRequest request) {
        try {
            authService.changePassword(
                    id,
                    request.getCurrentPassword(),
                    request.getNewPassword(),
                    request.getConfirmNewPassword()
            );

            return ResponseEntity.ok(Map.of("message", "PASSWORD UPDATED SUCCESSFULLY"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "PASSWORD UPDATE FAILED"));
        }
    }
}