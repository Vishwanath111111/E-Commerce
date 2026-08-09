package com.vastrada.service;

import com.vastrada.dto.AddressDTO;
import com.vastrada.dto.UserDTO;
import com.vastrada.entity.Address;
import com.vastrada.entity.User;
import com.vastrada.exception.ResourceNotFoundException;
import com.vastrada.repository.AddressRepository;
import com.vastrada.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private AuthService authService;

    public List<AddressDTO> getUserAddresses() {
        User currentUser = authService.getCurrentUser();
        return addressRepository.findByUserId(currentUser.getId()).stream()
                .map(AddressDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressDTO addAddress(AddressDTO dto) {
        User currentUser = authService.getCurrentUser();

        if (Boolean.TRUE.equals(dto.getIsDefault())) {
            List<Address> existing = addressRepository.findByUserId(currentUser.getId());
            for (Address addr : existing) {
                addr.setIsDefault(false);
                addressRepository.save(addr);
            }
        }

        Address address = new Address();
        address.setUser(currentUser);
        address.setFullName(dto.getFullName());
        address.setPhone(dto.getPhone());
        address.setAddressLine1(dto.getAddressLine1());
        address.setAddressLine2(dto.getAddressLine2());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setPostalCode(dto.getPostalCode());
        address.setCountry(dto.getCountry() != null ? dto.getCountry() : "India");
        address.setIsDefault(dto.getIsDefault() != null ? dto.getIsDefault() : false);
        address.setAddressType(dto.getAddressType() != null ? dto.getAddressType() : "HOME");

        return new AddressDTO(addressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(Long addressId) {
        User currentUser = authService.getCurrentUser();
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found: " + addressId));

        if (!address.getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Address not found for current user");
        }

        addressRepository.delete(address);
    }

    @Transactional
    public UserDTO updateProfile(UserDTO dto) {
        User currentUser = authService.getCurrentUser();
        currentUser.setFullName(dto.getFullName());
        currentUser.setPhone(dto.getPhone());
        return new UserDTO(userRepository.save(currentUser));
    }
}
