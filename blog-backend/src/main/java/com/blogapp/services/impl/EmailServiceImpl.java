package com.blogapp.services.impl;

import com.blogapp.entities.User;
import com.blogapp.exception.ResourceNotFoundException;
import com.blogapp.repositories.UserRepository;
import com.blogapp.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private JavaMailSender mailSender;

    private UserRepository userRepository;

    @Autowired
    public EmailServiceImpl(
            JavaMailSender mailSender,
            UserRepository userRepository
    ) {
        this.mailSender = mailSender;
        this.userRepository = userRepository;
    }

    @Override
    public void sendSimpleMail(String email, String token) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found", HttpStatus.NOT_FOUND));

        SimpleMailMessage message = new SimpleMailMessage();

        String emailBody = "Hello, "+ user.getName() +"\n\n" +
                "We received a request to reset your password. Please click the link below:\n\n" +
                "http://localhost:5173/reset-password?token=" + token + "\n\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "Best regards,\nYour Team";

        message.setTo(email);
        message.setSubject("BlogApp || Password Reset Request");
        message.setText(emailBody);

        mailSender.send(message);

    }

}
