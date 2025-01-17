package com.blogapp.controllers;

import com.blogapp.dto.UserList;
import com.blogapp.dto.CommonResponse;
import com.blogapp.dto.UserDTO;
import com.blogapp.dto.UserResponse;
import com.blogapp.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/getAllUser")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserList> getAllUsers(
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "createdAt", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir
    ){
        UserList response = userService.getAllUsers(pageNo, pageSize, sortBy, sortDir);

        response.setMessage("Get All Users Successfully");
        response.setSuccess(true);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping(value = "/update/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable("userId") Long userId,
            @RequestPart("userDTO") UserDTO userDTO,
            @RequestPart(value = "profilePic", required = false) MultipartFile profilePic
    ) {
        UserDTO updatedUser = userService.updateUser(userId, userDTO, profilePic);

        UserResponse response = new UserResponse();

        response.setUser(updatedUser);
        response.setSuccess(true);
        response.setMessage("User updated successfully");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<CommonResponse> deleteUser(@PathVariable("userId") Long userId){
        CommonResponse response = new CommonResponse();

        response.setMessage(userService.deleteUser(userId));
        response.setSuccess(true);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/getUser/{userId}")
    public ResponseEntity<UserResponse> getUser(@PathVariable("userId") Long userId){
        UserResponse response = new UserResponse();

        response.setSuccess(true);
        response.setMessage("User get successfully");
        response.setUser(userService.getUser(userId));

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
