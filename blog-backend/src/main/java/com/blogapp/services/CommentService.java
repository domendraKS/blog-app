package com.blogapp.services;

import com.blogapp.dto.CommentDTO;
import com.blogapp.dto.CommentLikeResponse;
import com.blogapp.dto.CommentList;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface CommentService {
    CommentDTO createComment(Long postId, CommentDTO commentDTO);

    List<CommentDTO> getComments(Long postId);

    CommentDTO updateComment(Long commentId, CommentDTO commentDTO);

    String deleteComment(Long commentId);

    CommentLikeResponse likeComment(Long commentId);

    CommentList getAllComments(int pageNo, int pageSize, String sortBy, String sortDir);

}
