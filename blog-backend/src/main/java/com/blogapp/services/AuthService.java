package com.blogapp.services;

import com.blogapp.dto.GoogleServiceRespDTO;
import com.blogapp.dto.LoginDTO;
import com.blogapp.dto.LoginServiceResp;
import com.blogapp.dto.UserDTO;
import org.springframework.web.multipart.MultipartFile;

public interface AuthService {

    String registration(UserDTO registerDTO);

    LoginServiceResp login(LoginDTO loginDTO);

    String generateTokenForgetPassword(String email);

    void resetPassword(String token, String password);

//    GoogleServiceRespDTO googleService(String name, String email, String profilePic);
}
