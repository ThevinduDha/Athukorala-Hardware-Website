package com.athukorala.inventory_system.service;

import com.athukorala.inventory_system.entity.User;
import com.athukorala.inventory_system.entity.Role;
import com.athukorala.inventory_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Public signup for Customers [cite: 65-67]
    public User registerCustomer(User user) {
        // Use getPassword() instead of password()
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.CUSTOMER); // Assign CUSTOMER role [cite: 209]
        return userRepository.save(user); // Save to MySQL [cite: 132]
    }

    // Admin-only: Create Staff or other Admins [cite: 78-80]
    public User createInternalUser(User user, Role role) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(role);
        return userRepository.save(user);
    }
}