package com.blogapp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private Long id;

    @NotEmpty(message = "Name cannot be empty")
    private String name;

    @NotEmpty(message = "Email cannot be empty")
    @Email(message = "Email is not valid please enter valid email")
    private String email;

    @NotEmpty(message = "Password cannot be empty")
    @Size(min = 6, max = 10, message = "Password must be between 6 to 10 characters")
    private String password;

    private boolean isAdmin;

    private String profilePic;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
