package com.athukorala.inventory_system.repository;

import com.athukorala.inventory_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // This allows the system to find a user by their email during login
    Optional<User> findByEmail(String email);

    // This helps us check if an email is already taken during signup
    Boolean existsByEmail(String email);
}