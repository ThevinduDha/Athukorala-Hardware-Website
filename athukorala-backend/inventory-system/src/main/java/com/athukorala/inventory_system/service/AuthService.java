package com.athukorala.inventory_system.service;

import com.athukorala.inventory_system.entity.User;
import com.athukorala.inventory_system.entity.Role;
import com.athukorala.inventory_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // No PasswordEncoder here to avoid startup crashes

    public User registerCustomer(User user) {
        user.setRole(Role.CUSTOMER);
        // Saving raw password directly to MySQL for testing
        return userRepository.save(user);
    }

    public User createInternalUser(User user, Role role) {
        user.setRole(role);
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Simple string matching: "password" == "password"
            if (password.equals(user.getPassword())) {
                return user;
            }
        }
        throw new RuntimeException("Invalid email or password");
    }
}