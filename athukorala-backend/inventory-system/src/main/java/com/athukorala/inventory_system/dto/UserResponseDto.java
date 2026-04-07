package com.athukorala.inventory_system.dto;

import com.athukorala.inventory_system.entity.Role;
import com.athukorala.inventory_system.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String profilePic;
    private Role role;
    private LocalDateTime createdAt;

    public static UserResponseDto fromEntity(User user) {
        if (user == null) {
            return null;
        }

        return UserResponseDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .profilePic(user.getProfilePic())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}