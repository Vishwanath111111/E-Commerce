package com.vastrada.controller;

import com.vastrada.dto.AddressDTO;
import com.vastrada.dto.ApiResponse;
import com.vastrada.dto.UserDTO;
import com.vastrada.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/account")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping("/addresses")
    public ResponseEntity<ApiResponse<List<AddressDTO>>> getUserAddresses() {
        return ResponseEntity.ok(ApiResponse.success("Addresses retrieved", accountService.getUserAddresses()));
    }

    @PostMapping("/addresses")
    public ResponseEntity<ApiResponse<AddressDTO>> addAddress(@Valid @RequestBody AddressDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Address added", accountService.addAddress(dto)));
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(@PathVariable Long id) {
        accountService.deleteAddress(id);
        return ResponseEntity.ok(ApiResponse.success("Address deleted", null));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> updateProfile(@RequestBody UserDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated", accountService.updateProfile(dto)));
    }
}
