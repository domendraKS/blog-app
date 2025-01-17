package com.blogapp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentList {

    private boolean success;

    private int pageNo;

    private int pageSize;

    private int totalPages;

    private boolean isLast;

    private Long totalComments;

    private long lastMonthComments;

    private String message;

    private List<CommentDTO> comments;

}
