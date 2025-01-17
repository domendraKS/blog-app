package com.blogapp.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PostList {

    private List<PostDTO> posts;

    private int pageNo;

    private int pageSize;

    private int totalPages;

    private boolean isLast;

    private long totalPosts;

    private long lastMonthPosts;

    private boolean success;

    private String message;

}
