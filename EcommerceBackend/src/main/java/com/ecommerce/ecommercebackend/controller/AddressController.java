package com.ecommerce.ecommercebackend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.ecommerce.ecommercebackend.entity.Address;
import com.ecommerce.ecommercebackend.entity.User;
import com.ecommerce.ecommercebackend.repository.AddressRepository;
import com.ecommerce.ecommercebackend.service.CurrentUserService;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressRepository addressRepository;
    private final CurrentUserService currentUserService;

    public AddressController(AddressRepository addressRepository, CurrentUserService currentUserService) {
        this.addressRepository = addressRepository;
        this.currentUserService = currentUserService;
    }

    // ADD ADDRESS (logged-in user ke naam par)
    @PostMapping
    public ResponseEntity<Address> addAddress(@RequestBody Address address) {

        User current = currentUserService.requireUser();

        address.setId(null);
        address.setUser(current);

        return ResponseEntity.status(HttpStatus.CREATED).body(addressRepository.save(address));
    }

    // MY ADDRESSES
    @GetMapping
    public List<Address> getMyAddresses() {
        return addressRepository.findByUser(currentUserService.requireUser());
    }

    // MY ADDRESSES (userId wala purana URL, sirf apni id chalegi)
    @GetMapping("/user/{userId}")
    public List<Address> getUserAddresses(@PathVariable Long userId) {

        User current = currentUserService.requireUser();

        if (!current.getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only view your own addresses");
        }

        return addressRepository.findByUser(current);
    }

    // UPDATE ADDRESS
    @PutMapping("/{id}")
    public Address updateAddress(@PathVariable Long id, @RequestBody Address address) {

        Address existing = findOwnedAddress(id);

        existing.setName(address.getName());
        existing.setPhone(address.getPhone());
        existing.setLine1(address.getLine1());
        existing.setCity(address.getCity());
        existing.setState(address.getState());
        existing.setPincode(address.getPincode());

        return addressRepository.save(existing);
    }

    // DELETE ADDRESS
    @DeleteMapping("/{id}")
    public Map<String, String> deleteAddress(@PathVariable Long id) {
        addressRepository.delete(findOwnedAddress(id));
        return Map.of("message", "Address deleted successfully");
    }

    private Address findOwnedAddress(Long id) {

        User current = currentUserService.requireUser();

        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found"));

        if (address.getUser() == null || !address.getUser().getId().equals(current.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This address is not yours");
        }

        return address;
    }
}
