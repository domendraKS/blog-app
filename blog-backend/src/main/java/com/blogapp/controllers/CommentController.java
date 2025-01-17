package com.blogapp.controllers;

import com.blogapp.dto.*;
import com.blogapp.services.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comment")
public class CommentController {

    private CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/add/{postId}")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable("postId") Long postId,
            @Valid @RequestBody CommentDTO commentDTO
    ) {
        CommentDTO comment = commentService.createComment(postId, commentDTO);

        CommentResponse response = new CommentResponse();
        response.setComment(comment);
        response.setMessage("Comment posted");
        response.setSuccess(true);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    //get all comments of particular post
    @GetMapping("/{postId}")
    public ResponseEntity<CommentList> getComments(
            @PathVariable("postId") Long postId
    ) {
        List<CommentDTO> comments = commentService.getComments(postId);

        CommentList response = new CommentList();

        response.setComments(comments);
        response.setMessage("Get All comments successfully");
        response.setSuccess(true);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/update/{commentId}")
    public ResponseEntity<CommentResponse> editComment(
            @PathVariable("commentId") Long commentId,
            @Valid @RequestBody CommentDTO commentDTO
    ) {
        CommentDTO updatedComment = commentService.updateComment(commentId, commentDTO);

        CommentResponse response = new CommentResponse();
        response.setComment(updatedComment);
        response.setMessage("Comment posted");
        response.setSuccess(true);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{commentId}")
    public ResponseEntity<CommonResponse> deleteComment(@PathVariable("commentId") Long commentId){
        CommonResponse response = new CommonResponse();

        response.setMessage(commentService.deleteComment(commentId));
        response.setSuccess(true);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/likeComment/{commentId}")
    public ResponseEntity<CommentResponse> likeComment(
            @PathVariable("commentId") Long commentId
    ){
        CommentLikeResponse serviceResponse = commentService.likeComment(commentId);

        CommentResponse response = new CommentResponse();

        response.setComment(serviceResponse.getCommentDTO());
        response.setSuccess(true);

        if(serviceResponse.isLiked()){
            response.setMessage("Comment liked");
        }else {
            response.setMessage("Like removed");
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    //get all comments of particular
    @GetMapping("/getComments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommentList> getAllComments(
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "createdAt", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir
    ){
        CommentList response = commentService.getAllComments(pageNo, pageSize, sortBy, sortDir);

        response.setSuccess(true);
        response.setMessage("Get All Comments successfully.");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
