package com.blogapp.services;

import com.blogapp.dto.UserList;
import com.blogapp.dto.UserDTO;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {

    UserDTO updateUser(Long userId, UserDTO userDTO, MultipartFile image);

    String deleteUser(Long userId);

    UserList getAllUsers(int pageNo, int pageSize, String sortBy, String sortDir);

    UserDTO getUser(Long userId);
}
