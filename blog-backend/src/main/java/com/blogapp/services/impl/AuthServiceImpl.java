package com.blogapp.services.impl;

import com.blogapp.dto.GoogleServiceRespDTO;
import com.blogapp.dto.LoginDTO;
import com.blogapp.dto.LoginServiceResp;
import com.blogapp.dto.UserDTO;
import com.blogapp.entities.PasswordResetToken;
import com.blogapp.entities.User;
import com.blogapp.exception.BlogAPIException;
import com.blogapp.exception.ResourceNotFoundException;
import com.blogapp.repositories.TokenRepository;
import com.blogapp.repositories.UserRepository;
import com.blogapp.security.JwtTokenProvider;
import com.blogapp.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private UserRepository userRepository;

    private PasswordEncoder passwordEncoder;

    private AuthenticationManager authenticationManager;

    private JwtTokenProvider jwtTokenProvider;

    private TokenRepository tokenRepository;

    @Autowired
    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtTokenProvider jwtTokenProvider,
                           TokenRepository tokenRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.tokenRepository = tokenRepository;
    }

    @Override
    public String registration(UserDTO userDTO) {

        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new BlogAPIException(HttpStatus.CONFLICT, "This email is already registered");
        }

        User newUser = new User();
        newUser.setName(userDTO.getName());
        newUser.setEmail(userDTO.getEmail());
        newUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        newUser.setAdmin(false);

        userRepository.save(newUser);

        return "User registered successfully";

    }

    @Override
    public LoginServiceResp login(LoginDTO loginDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);

        String email = ((UserDetails) authentication.getPrincipal()).getUsername();

        Optional<User> user = userRepository.findByEmail(email);
        User respUser = user.get();

        return new LoginServiceResp(mapToDTO(respUser), token);
    }

    @Override
    public String generateTokenForgetPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Email is not registered", HttpStatus.NOT_FOUND));

        // Check if token already exists for the user
        PasswordResetToken resetToken = tokenRepository.findByUser(user);

        if (resetToken != null) {
            resetToken.setToken(UUID.randomUUID().toString());
            resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));
        } else {
            // Create a new token
            resetToken = new PasswordResetToken();
            resetToken.setToken(UUID.randomUUID().toString());
            resetToken.setUser(user);
            resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));
        }

        tokenRepository.save(resetToken);

        return resetToken.getToken();
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token."));


        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Expired token.");
        }

        if (!isValidPassword(newPassword)) {
            throw new IllegalArgumentException("Password does not meet security requirements.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }

//    @Override
//    public GoogleServiceRespDTO googleService(String name, String email, String profilePic) {
//        GoogleServiceRespDTO respDTO = new GoogleServiceRespDTO();
//
//        Optional<User> existingUser = userRepository.findByEmail(email);
//
//        if(existingUser.isPresent()){
//            User user = existingUser.get();
//
//            Authentication authentication = authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(email, user.getPassword())
//            );
//
//            SecurityContextHolder.getContext().setAuthentication(authentication);
//
//            String token = jwtTokenProvider.generateToken(authentication);
//
//            respDTO.setToken(token);
//            respDTO.setMessage("Login successfully");
//            respDTO.setUserDTO(mapToDTO(user));
//        } else {
//            String generatedPassword = generatedPassword();
//            String encodedPassword = passwordEncoder.encode(generatedPassword);
//
//            User newUser = new User();
//
//            newUser.setName(name);
//            newUser.setEmail(email);
//            newUser.setPassword(encodedPassword);
//            newUser.setAdmin(false);
//
//            if(profilePic != null){
//                newUser.setProfilePic(profilePic);
//            }
//
//            userRepository.save(newUser);
//
//            Authentication authentication = authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(email, generatedPassword)
//            );
//
//            SecurityContextHolder.getContext().setAuthentication(authentication);
//
//            String token = jwtTokenProvider.generateToken(authentication);
//
//            respDTO.setUserDTO(mapToDTO(newUser));
//            respDTO.setToken(token);
//            respDTO.setMessage("User created Successfully");
//        }
//
//        return respDTO;
//    }

//    private String generatedPassword() {
//        return UUID.randomUUID().toString().substring(0, 8) + UUID.randomUUID().toString().substring(0, 8);
//    }

    private boolean isValidPassword(String password) {
        return password.length() >= 8; // Example: Add your own validation rules
    }

    private UserDTO mapToDTO(User user){
        UserDTO dto = new UserDTO();

        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setAdmin(user.isAdmin());
        dto.setProfilePic(user.getProfilePic());
        dto.setPassword(null);

        return dto;
    }

}
