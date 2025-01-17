package com.blogapp.controllers;

import com.blogapp.dto.*;
import com.blogapp.services.AuthService;
import com.blogapp.services.EmailService;
import com.blogapp.utils.CookieUtils;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private AuthService authService;

    private EmailService emailService;

    @Autowired
    public AuthController(
            AuthService authService, EmailService emailService
    ) {
        this.authService = authService;
        this.emailService = emailService;
    }

    @PostMapping(value = {"/signup", "/register"})
    public ResponseEntity<String> register(@Valid @RequestBody UserDTO userDTO) {
        String response = authService.registration(userDTO);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping(value = {"/signin", "/login"})
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginDTO loginDTO,
            HttpServletResponse response
    ) {
        LoginServiceResp serviceResponse = authService.login(loginDTO);

        CookieUtils.addJwtCookie(serviceResponse.getToken(), response);

        LoginResponse loginResponse = new LoginResponse();

        loginResponse.setUser(serviceResponse.getUserDTO());
        loginResponse.setMessage("Login successfully");
        loginResponse.setSuccess(true);

        return new ResponseEntity<>(loginResponse, HttpStatus.OK);
    }

    @PostMapping(value = {"/signout", "logout"})
    public ResponseEntity<String> logout(HttpServletResponse response) {
        CookieUtils.clearCookie(response);

        return new ResponseEntity<>("Logout successfully", HttpStatus.OK);
    }

    @PostMapping("/forget-password")
    public ResponseEntity<CommonResponse> forgetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        String token = authService.generateTokenForgetPassword(email);

        CommonResponse response = new CommonResponse(true, "Password reset link sent to your email.");

        emailService.sendSimpleMail(email, token);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<CommonResponse> resetPassword(
            @RequestBody Map<String, String> request
    ) {
        String token = request.get("token");
        String newPassword = request.get("password");

        CommonResponse response = new CommonResponse(true, "Password reset successfully.");

        authService.resetPassword(token, newPassword);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

//    @PostMapping("/google")
//    public ResponseEntity<LoginResponse> googleAuth(
//            @Valid @RequestBody GoogleDTO googleDTO,
//            HttpServletResponse httpResp
//            ) {
//        GoogleServiceRespDTO serviceResp = authService.googleService(googleDTO.getName(), googleDTO.getEmail(), googleDTO.getProfilePic());
//
//        LoginResponse response = new LoginResponse();
//
//        CookieUtils.addJwtCookie(serviceResp.getToken(), httpResp);
//
//        response.setSuccess(true);
//        response.setMessage(serviceResp.getMessage());
//        response.setUser(serviceResp.getUserDTO());
//
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }

}
