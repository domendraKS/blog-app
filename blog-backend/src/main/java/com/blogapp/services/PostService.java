package com.blogapp.services;

import com.blogapp.dto.PostDTO;
import com.blogapp.dto.PostList;
import com.blogapp.dto.PostResponse;
import org.springframework.web.multipart.MultipartFile;

public interface PostService {

    PostDTO createPost(PostDTO postDTO, MultipartFile postImg);

    PostList getAllPosts(int pageNo, int pageSize, String sortBy, String sortDir, String category, String searchTerm);

    PostDTO getPost(Long id);

    void deletePost(Long id);

    PostDTO updatePost(Long id, PostDTO postDTO, MultipartFile postImg);

    PostDTO getBySlugs(String slug);
}
