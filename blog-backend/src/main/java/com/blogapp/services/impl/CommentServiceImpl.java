package com.blogapp.services.impl;

import com.blogapp.dto.CommentDTO;
import com.blogapp.dto.CommentLikeResponse;
import com.blogapp.dto.CommentList;
import com.blogapp.entities.Comment;
import com.blogapp.entities.Post;
import com.blogapp.entities.User;
import com.blogapp.exception.BlogAPIException;
import com.blogapp.exception.ResourceNotFoundException;
import com.blogapp.repositories.CommentRepository;
import com.blogapp.repositories.PostRepository;
import com.blogapp.repositories.UserRepository;
import com.blogapp.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    private CommentRepository commentRepository;

    private PostRepository postRepository;

    private UserRepository userRepository;


    @Autowired
    public CommentServiceImpl(
            CommentRepository commentRepository,
            PostRepository postRepository,
            UserRepository userRepository
    ) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    @Override
    public CommentDTO createComment(Long postId, CommentDTO commentDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("Please login first", HttpStatus.NOT_FOUND));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not available", HttpStatus.NOT_FOUND));

        Comment newComment = new Comment();

        newComment.setContent(commentDTO.getContent());
        newComment.setUser(user);
        newComment.setPost(post);

        Comment savedComment = commentRepository.save(newComment);

        return mapTOCommentDTO(savedComment);
    }

    @Override
    public List<CommentDTO> getComments(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not available", HttpStatus.NOT_FOUND));

        List<Comment> comments = commentRepository.findByPostId(postId);

        return comments.stream()
                .sorted(Comparator.comparing(Comment::getCreatedAt).reversed())
                .map(comment -> {
                            return mapTOCommentDTO(comment);
                        }
                )
                .collect(Collectors.toList());
    }

    @Override
    public CommentDTO updateComment(Long commentId, CommentDTO commentDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("Please login first", HttpStatus.NOT_FOUND));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not exist", HttpStatus.NOT_FOUND));

        if (user.getId() != comment.getUser().getId() && !user.isAdmin()) {
            throw new BlogAPIException(HttpStatus.FORBIDDEN, "You are not allowed to update this comment");
        }

        comment.setContent(commentDTO.getContent());

        Comment updatedComment = commentRepository.save(comment);

        return mapTOCommentDTO(updatedComment);

    }

    @Override
    public String deleteComment(Long commentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("Please login first", HttpStatus.NOT_FOUND));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not exist", HttpStatus.NOT_FOUND));

        if (user.getId() != comment.getUser().getId() && !user.isAdmin()) {
            throw new BlogAPIException(HttpStatus.FORBIDDEN, "You are not allowed to delete this comment");
        }

        commentRepository.delete(comment);

        return "Comment deleted successfully";
    }

    @Override
    public CommentLikeResponse likeComment(Long commentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("Please login first", HttpStatus.NOT_FOUND));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment does not exist", HttpStatus.NOT_FOUND));

        boolean isLiked;

        if (comment.getLikedByUsers().contains(user)) {
            comment.getLikedByUsers().remove(user);
            comment.setNumberOfLikes(comment.getNumberOfLikes() - 1);
            isLiked = false;
        } else {
            comment.getLikedByUsers().add(user);
            comment.setNumberOfLikes(comment.getNumberOfLikes() + 1);
            isLiked = true;
        }

        Comment savedComment = commentRepository.save(comment);

        return new CommentLikeResponse(mapTOCommentDTO(savedComment), isLiked);
    }

    @Override
    public CommentList getAllComments(int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort sort;

        if (sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())) {
            sort = Sort.by(sortBy).ascending();
        } else {
            sort = Sort.by(sortBy).descending();
        }

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<Comment> commentsWithPage = commentRepository.findAll(pageable);

        List<Comment> comments = commentsWithPage.getContent();

        CommentList response = new CommentList();

        long lastMonthComments = commentRepository.countCommentsFromLastMonth(LocalDateTime.now().minusMonths(1));

        response.setComments(
                comments.stream()
                        .map(this::mapTOCommentDTO).collect(Collectors.toList())
        );
        response.setTotalComments(commentsWithPage.getTotalElements());
        response.setTotalPages(commentsWithPage.getTotalPages());
        response.setLastMonthComments(lastMonthComments);
        response.setPageNo(commentsWithPage.getNumber());
        response.setPageSize(commentsWithPage.getSize());
        response.setLast(commentsWithPage.isLast());

        return response;
    }

    public CommentDTO mapTOCommentDTO(Comment comment) {
        CommentDTO responseComment = new CommentDTO();

        responseComment.setId(comment.getId());
        responseComment.setContent(comment.getContent());

        if (comment.getUser() != null) {
            responseComment.setName(comment.getUser().getName());
            responseComment.setUser_id(comment.getUser().getId());
        }else{
            responseComment.setUser_id(null);
            responseComment.setName("Anonymous");
        }

        responseComment.setPost_id(comment.getPost().getId());
        responseComment.setPostTitle(comment.getPost().getTitle());

        responseComment.setNumberOfLikes(comment.getNumberOfLikes());
        responseComment.setLikedByUserIds(
                comment.getLikedByUsers().stream().map(User::getId).collect(Collectors.toSet())
        );
        responseComment.setCreatedAt(comment.getCreatedAt());
        responseComment.setUpdatedAt(comment.getUpdatedAt());

        return responseComment;
    }

}
