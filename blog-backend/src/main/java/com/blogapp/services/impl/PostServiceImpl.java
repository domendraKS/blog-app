package com.blogapp.services.impl;

import com.blogapp.dto.PostDTO;
import com.blogapp.dto.PostList;
import com.blogapp.entities.Category;
import com.blogapp.entities.Post;
import com.blogapp.entities.User;
import com.blogapp.exception.BlogAPIException;
import com.blogapp.exception.ResourceNotFoundException;
import com.blogapp.repositories.CategoryRepository;
import com.blogapp.repositories.PostRepository;
import com.blogapp.repositories.UserRepository;
import com.blogapp.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {

    private PostRepository postRepository;

    private UserRepository userRepository;

    private CategoryRepository categoryRepository;

    @Autowired
    public PostServiceImpl(
            PostRepository postRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository
    ) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public PostDTO createPost(PostDTO postDTO, MultipartFile postImg) {
        if (postRepository.existsByTitle(postDTO.getTitle())) {
            throw new BlogAPIException(HttpStatus.CONFLICT, "Title is already present");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String userEmail = authentication.getName();

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found", HttpStatus.NOT_FOUND));

        Category category = categoryRepository.findByName(postDTO.getCategory())
                .orElseThrow(() -> new ResourceNotFoundException("Category Not found", HttpStatus.NOT_FOUND));

        Post newPost = mapToPost(postDTO, user, postImg, category);

        Post savedPost = postRepository.save(newPost);

        return mapToDTO(savedPost);
    }

    @Override
    public PostList getAllPosts(
            int pageNo, int pageSize, String sortBy, String sortDir, String category, String searchTerm
    ) {
        if (postRepository.count() == 0) {
            throw new BlogAPIException(HttpStatus.NOT_FOUND, "No posts are available.");
        }

        Sort sort;
        if (sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())) {
            sort = Sort.by(sortBy).ascending();
        } else {
            sort = Sort.by(sortBy).descending();
        }

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<Post> postsWithPage;

        if (category != null && !category.equalsIgnoreCase("uncategorized")) {
            if (searchTerm != null && !searchTerm.isBlank()) {
                postsWithPage = postRepository.findByCategoryNameAndTitleOrContentContainingIgnoreCase(category, searchTerm, pageable);
            } else {
                postsWithPage = postRepository.findByCategoryName(category, pageable);
            }
        } else {
            if (searchTerm != null && !searchTerm.isBlank()) {
                postsWithPage = postRepository.findByTitleOrContentContainingIgnoreCase(searchTerm, pageable);
            } else {
                postsWithPage = postRepository.findAll(pageable);
            }
        }

        List<Post> posts = postsWithPage.getContent();

        List<PostDTO> postsDto = posts.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        long lastMonthPosts = postRepository.countPostsFromLastMonth(LocalDateTime.now().minusMonths(1));

        PostList listOfPosts = new PostList();

        listOfPosts.setPosts(postsDto);
        listOfPosts.setPageNo(postsWithPage.getNumber());
        listOfPosts.setPageSize(postsWithPage.getSize());
        listOfPosts.setTotalPages(postsWithPage.getTotalPages());
        listOfPosts.setLast(postsWithPage.isLast());
        listOfPosts.setTotalPosts(postsWithPage.getTotalElements());
        listOfPosts.setLastMonthPosts(lastMonthPosts);

        return listOfPosts;
    }

    @Override
    public PostDTO getPost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found.", HttpStatus.NOT_FOUND));

        return mapToDTO(post);
    }

    @Override
    public void deletePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found.", HttpStatus.NOT_FOUND));

        if (post.getPostImg() != null) {
            String imagePath = "src/main/resources/static" + post.getPostImg();
            try {
                Files.deleteIfExists(Paths.get(imagePath)); //Delete the file
            } catch (IOException e) {
                throw new BlogAPIException(HttpStatus.INTERNAL_SERVER_ERROR, "Error while deleting post image");
            }
        }

        postRepository.delete(post);
    }

    @Override
    public PostDTO updatePost(Long id, PostDTO postDTO, MultipartFile postImg) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found", HttpStatus.NOT_FOUND));

        if (postDTO.getTitle() != null && !postDTO.getTitle().isBlank()) {
            post.setTitle(postDTO.getTitle());
        }

        if (postDTO.getContent() != null && !postDTO.getContent().isBlank()) {
            post.setContent(postDTO.getContent());
        }

        if(postDTO.getCategory() != null && !postDTO.getCategory().isBlank()){
            Category category = categoryRepository.findByName(postDTO.getCategory())
                            .orElseThrow(() -> new ResourceNotFoundException("Category Not Found", HttpStatus.NOT_FOUND));
            post.setCategory(category);
        }

        if (postImg != null && !postImg.isEmpty()) {
            if (post.getPostImg() != null) {
                String imagePath = "src/main/resources/static" + post.getPostImg();
                try {
                    Files.deleteIfExists(Paths.get(imagePath)); //Delete the file
                } catch (IOException e) {
                    throw new BlogAPIException(HttpStatus.INTERNAL_SERVER_ERROR, "Error while deleting post image");
                }
            }

            String uploadDir = "src/main/resources/static/postImgs/";
            String fileName = System.currentTimeMillis() + "_" + postImg.getOriginalFilename().replaceAll(" ", "-");
            try {
                //Ensures that the target directory exists; if it doesn’t, it will create it.
                Files.createDirectories(Paths.get(uploadDir));

                // Constructs the full path (directory + filename) for where the uploaded file will be saved.
                Path filePath = Paths.get(uploadDir + fileName);

                //Saves the uploaded file (image) to the specified directory and filename.
                Files.write(filePath, postImg.getBytes());

                post.setPostImg("/postImgs/" + fileName);
            } catch (IOException e) {
                throw new BlogAPIException(HttpStatus.INTERNAL_SERVER_ERROR, "Error while processing post image");
            }
        }

        Post updatedPost = postRepository.save(post);

        return mapToDTO(updatedPost);
    }

    @Override
    public PostDTO getBySlugs(String slug) {
        Post post = postRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found.", HttpStatus.NOT_FOUND));

        return mapToDTO(post);
    }

    private static Post mapToPost(PostDTO postDTO, User user, MultipartFile postImg, Category category) {
        Post newPost = new Post();
        newPost.setTitle(postDTO.getTitle());
        newPost.setContent(postDTO.getContent());
        newPost.setUser(user);
        newPost.setCategory(category);

        if (postImg != null && !postImg.isEmpty()) {
            String uploadDir = "src/main/resources/static/postImgs/";
            String fileName = System.currentTimeMillis() + "_" + postImg.getOriginalFilename().replaceAll(" ", "-");
            try {
                //Ensures that the target directory exists; if it doesn’t, it will create it.
                Files.createDirectories(Paths.get(uploadDir));

                // Constructs the full path (directory + filename) for where the uploaded file will be saved.
                Path filePath = Paths.get(uploadDir + fileName);

                //Saves the uploaded file (image) to the specified directory and filename.
                Files.write(filePath, postImg.getBytes());

                newPost.setPostImg("/postImgs/" + fileName);
            } catch (IOException e) {
                throw new BlogAPIException(HttpStatus.INTERNAL_SERVER_ERROR, "Error while processing post image");
            }
        }

        return newPost;
    }

    private PostDTO mapToDTO(Post post) {
        PostDTO dto = new PostDTO();

        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setSlug(post.getSlug());

        if (post.getCategory() != null) {
            dto.setCategory(post.getCategory().getName());
        } else {
            dto.setCategory("uncategorized");
        }

        dto.setPostImg(post.getPostImg());
        dto.setUserId(post.getUser().getId());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());

        return dto;
    }
}
