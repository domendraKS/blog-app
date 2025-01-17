package com.blogapp.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostDTO {

    private Long id;

    @NotEmpty(message = "Post title cannot be empty")
    private String title;

    @NotEmpty(message = "Post content cannot be empty")
    private String content;

    private String slug;

    private Long userId;

    private String postImg;

    private String category;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
