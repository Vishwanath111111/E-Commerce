package com.vastrada.controller;

import com.vastrada.dto.ApiResponse;
import com.vastrada.dto.AuthRequest;
import com.vastrada.dto.AuthResponse;
import com.vastrada.dto.RegisterRequest;
import com.vastrada.dto.UserDTO;
import com.vastrada.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Registration successful", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> me() {
        UserDTO user = authService.getCurrentUserProfile();
        return ResponseEntity.ok(ApiResponse.success("User profile fetched", user));
    }
}
