package com.blogapp.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentDTO {
    private Long id;

    @NotEmpty(message = "Comment content cannot be empty")
    private String content;

    private Long post_id;
    private String postTitle;

    private Long user_id;
    private String name;

    private int numberOfLikes;
    private Set<Long> likedByUserIds;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
