package com.blogapp.services.impl;

import com.blogapp.dto.UserList;
import com.blogapp.dto.UserDTO;
import com.blogapp.entities.User;
import com.blogapp.exception.BlogAPIException;
import com.blogapp.exception.ResourceNotFoundException;
import com.blogapp.repositories.CommentRepository;
import com.blogapp.repositories.UserRepository;
import com.blogapp.services.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;

    private PasswordEncoder passwordEncoder;

    private CommentRepository commentRepository;

    @Autowired
    public UserServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            CommentRepository commentRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.commentRepository = commentRepository;
    }

    @Override
    public UserDTO updateUser(Long userId, UserDTO userDTO, MultipartFile image) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String userEmail = authentication.getName();

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Please login first", HttpStatus.NOT_FOUND));

        if (!userId.equals(user.getId())) {
            throw new BlogAPIException(HttpStatus.UNAUTHORIZED, "You are not authorized to update this profile");
        }

        if ((userDTO.getEmail() == null || userDTO.getEmail().isBlank()) &&
                (userDTO.getName() == null || userDTO.getName().isBlank()) &&
                (userDTO.getPassword() == null || userDTO.getPassword().isBlank()) &&
                (image == null || image.isEmpty())) {
            throw new BlogAPIException(HttpStatus.BAD_REQUEST, "No changes provided for update");
        }

        if (userDTO.getEmail() != null && !userDTO.getEmail().isBlank()) {
            Optional<User> existUserEmail = userRepository.findByEmail(userDTO.getEmail());

            if (existUserEmail.isPresent() && !existUserEmail.get().getId().equals(userId)) {
                throw new BlogAPIException(HttpStatus.CONFLICT, "Email is already in use by another account");
            }

            user.setEmail(userDTO.getEmail());
        }

        if (userDTO.getName() != null && !userDTO.getName().isBlank()) {
            user.setName(userDTO.getName());
        }

        if (userDTO.getPassword() != null && !userDTO.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        if (image != null && !image.isEmpty()) {
            if (user.getProfilePic() != null) {
                String imagePath = "src/main/resources/static" + user.getProfilePic();
                try {
                    Files.deleteIfExists(Paths.get(imagePath));
                } catch (IOException e) {
                    throw new BlogAPIException(HttpStatus.INTERNAL_SERVER_ERROR, "Error while deleting profile image");
                }
            }

            String uploadDir = "src/main/resources/static/userImgs/";

            String originalFilename = image.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));

            String fileName = user.getId() + "_" + System.currentTimeMillis() + "_" + user.getName().replaceAll(" ", "-") + fileExtension;
            try {
                Files.createDirectories(Paths.get(uploadDir));

                Path filePath = Paths.get(uploadDir + fileName);

                Files.write(filePath, image.getBytes());

                user.setProfilePic("/userImgs/" + fileName);
            } catch (IOException e) {
                throw new BlogAPIException(HttpStatus.INTERNAL_SERVER_ERROR, "Error while processing profile picture");
            }
        }

        User savedUser = userRepository.save(user);

        return mapToUserDTO(savedUser);
    }

    @Transactional
    @Override
    public String deleteUser(Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String userEmail = authentication.getName();

        User authenticatedUser  = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Please login first", HttpStatus.NOT_FOUND));

        if (!userId.equals(authenticatedUser .getId()) && !authenticatedUser .isAdmin()) {
            throw new BlogAPIException(HttpStatus.UNAUTHORIZED, "You are not authorized to delete this profile");
        }

        User userToDelete  = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Please login first", HttpStatus.NOT_FOUND));

        if (userToDelete.getProfilePic() != null) {
            String imagePath = "src/main/resources/static" + userToDelete.getProfilePic();
            try {
                Files.deleteIfExists(Paths.get(imagePath));
            } catch (IOException e) {
                throw new BlogAPIException(HttpStatus.INTERNAL_SERVER_ERROR, "Error while deleting profile image");
            }
        }

        commentRepository.setUserToNull(userId);
        userRepository.delete(userToDelete);

        return "User deleted successfully";
    }

    @Override
    public UserList getAllUsers(int pageNo, int pageSize, String sortBy, String sortDir) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String userEmail = authentication.getName();

        User loggedInUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Please login first", HttpStatus.NOT_FOUND));

        if (!loggedInUser.isAdmin()) {
            throw new BlogAPIException(HttpStatus.FORBIDDEN, "You are not authorized to see all users details");
        }

        Sort sort;
        if (sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())) {
            sort = Sort.by(sortBy).ascending();
        } else {
            sort = Sort.by(sortBy).descending();
        }

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<User> usersWithPage = userRepository.findAll(pageable);
        List<User> allUsers = usersWithPage.getContent();

        List<UserDTO> users = allUsers.stream()
                .map(user -> mapToUserDTO(user))
                .collect(Collectors.toList());

        long lastMonthUserCount = userRepository.countLastMonthUsers(LocalDateTime.now().minusMonths(1));

        UserList response = new UserList();
        response.setUsers(users);
        response.setTotalUsers(users.size());
        response.setLastMonthUsers(lastMonthUserCount);
        response.setLast(usersWithPage.isLast());
        response.setPageNo(usersWithPage.getNumber());
        response.setPageSize(usersWithPage.getSize());
        response.setTotalPages(usersWithPage.getTotalPages());

        return response;
    }

    @Override
    public UserDTO getUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found", HttpStatus.NOT_FOUND));

        return mapToUserDTO(user);
    }

    public static UserDTO mapToUserDTO(User user) {
        UserDTO userDTO = new UserDTO();

        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setProfilePic(user.getProfilePic());
        userDTO.setAdmin(user.isAdmin());

        return userDTO;
    }
}
