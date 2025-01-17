package com.blogapp.controllers;

import com.blogapp.dto.CommonResponse;
import com.blogapp.dto.PostDTO;
import com.blogapp.dto.PostList;
import com.blogapp.dto.PostResponse;
import com.blogapp.services.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/post")
public class PostController {

    private PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping("/savePost")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PostResponse> createPost(
            @Valid @RequestPart("postDTO") PostDTO postDTO,
            @RequestPart(value = "postImg", required = false) MultipartFile postImg
    ) {
        PostDTO post = postService.createPost(postDTO, postImg);

        PostResponse response = new PostResponse();

        response.setPost(post);
        response.setSuccess(true);
        response.setMessage("Post created successfully");

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    //get all posts
    @GetMapping("/getPosts")
    public ResponseEntity<PostList> getAllPost(
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "createdAt", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "searchTerm", required = false) String searchTerm
    ) {
        PostList responses = postService.getAllPosts(pageNo, pageSize, sortBy, sortDir, category, searchTerm);

        responses.setSuccess(true);
        responses.setMessage("Get all Posts successfully");

        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    //get single post by id
    @GetMapping("/getPost/{id}")
    public ResponseEntity<PostResponse> getPost(@PathVariable("id") Long id) {
        PostDTO post = postService.getPost(id);

        PostResponse response = new PostResponse();

        response.setPost(post);
        response.setSuccess(true);
        response.setMessage("Get post successfully");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommonResponse> deletePost(@PathVariable("id") Long id) {
        CommonResponse response = new CommonResponse();

        postService.deletePost(id);

        response.setSuccess(true);
        response.setMessage("Post deleted successfully");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable("id") Long id,
            @RequestPart PostDTO postDTO,
            @RequestPart(value = "postImg", required = false) MultipartFile postImg
    ) {
        PostDTO updatedPost = postService.updatePost(id, postDTO, postImg);

        PostResponse response = new PostResponse();

        response.setPost(updatedPost);
        response.setMessage("Post updated successfully");
        response.setSuccess(true);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/getPost")
    public ResponseEntity<PostResponse> getBySlug(
            @RequestParam("slug") String slug
    ){
//        System.out.println(slug);
        PostResponse response = new PostResponse();

        response.setPost(postService.getBySlugs(slug));
        response.setMessage("Get Post successfully.");
        response.setSuccess(true);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
