package com.safouane.backend.service;

import com.safouane.backend.dto.AddressDTO;
import com.safouane.backend.dto.UserDTO;
import com.safouane.backend.model.Address;
import com.safouane.backend.model.User;
import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final Map<Long, User> users = new LinkedHashMap<>();
    private final AtomicLong userIdCounter = new AtomicLong(1);
    private final AtomicLong addressIdCounter = new AtomicLong(1);

    @PostConstruct
    public void seedData() {
        createSeedUser("John", "Doe", "john.doe@example.com", "12 Oak Street", "London", "UK", "4 King Road", "Manchester", "UK");
        createSeedUser("Emma", "Smith", "emma.smith@example.com", "87 Pine Avenue", "New York", "USA", "45 Cedar Lane", "Boston", "USA");
        createSeedUser("Liam", "Brown", "liam.brown@example.com", "3 Maple Drive", "Dublin", "Ireland", "22 River Walk", "Cork", "Ireland");
        createSeedUser("Sofia", "Garcia", "sofia.garcia@example.com", "11 Sunset Blvd", "Madrid", "Spain", "9 Central Plaza", "Barcelona", "Spain");
        createSeedUser("Noah", "Wilson", "noah.wilson@example.com", "60 Hill Street", "Toronto", "Canada", "19 Lake View", "Vancouver", "Canada");
    }

    public List<UserDTO> getAllUsers() {
        return users.values().stream().map(this::toUserDTO).toList();
    }

    public UserDTO getUserById(Long id) {
        return toUserDTO(getExistingUser(id));
    }

    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User existingUser = getExistingUser(id);
        existingUser.setFirstName(userDTO.getFirstName());
        existingUser.setLastName(userDTO.getLastName());
        existingUser.setEmail(userDTO.getEmail());
        return toUserDTO(existingUser);
    }

    public AddressDTO addAddress(Long userId, AddressDTO addressDTO) {
        User user = getExistingUser(userId);
        Address newAddress = Address.builder()
            .id(addressIdCounter.getAndIncrement())
            .street(addressDTO.getStreet())
            .city(addressDTO.getCity())
            .country(addressDTO.getCountry())
            .build();
        user.getAddresses().add(newAddress);
        return toAddressDTO(newAddress);
    }

    public AddressDTO updateAddress(Long userId, Long addressId, AddressDTO addressDTO) {
        Address existingAddress = getExistingAddress(getExistingUser(userId), addressId);
        existingAddress.setStreet(addressDTO.getStreet());
        existingAddress.setCity(addressDTO.getCity());
        existingAddress.setCountry(addressDTO.getCountry());
        return toAddressDTO(existingAddress);
    }

    public void deleteAddress(Long userId, Long addressId) {
        User user = getExistingUser(userId);
        boolean removed = user.getAddresses().removeIf(address -> addressId.equals(address.getId()));
        if (!removed) {
            throw new NoSuchElementException("Address not found for user id: " + userId);
        }
    }

    private void createSeedUser(
        String firstName,
        String lastName,
        String email,
        String street1,
        String city1,
        String country1,
        String street2,
        String city2,
        String country2
    ) {
        Long userId = userIdCounter.getAndIncrement();
        List<Address> addresses = new ArrayList<>();
        addresses.add(Address.builder().id(addressIdCounter.getAndIncrement()).street(street1).city(city1).country(country1).build());
        addresses.add(Address.builder().id(addressIdCounter.getAndIncrement()).street(street2).city(city2).country(country2).build());

        User user = User.builder()
            .id(userId)
            .firstName(firstName)
            .lastName(lastName)
            .email(email)
            .addresses(addresses)
            .build();

        users.put(userId, user);
    }

    private User getExistingUser(Long id) {
        User user = users.get(id);
        if (user == null) {
            throw new NoSuchElementException("User not found with id: " + id);
        }
        return user;
    }

    private Address getExistingAddress(User user, Long addressId) {
        return user.getAddresses()
            .stream()
            .filter(address -> addressId.equals(address.getId()))
            .findFirst()
            .orElseThrow(() -> new NoSuchElementException("Address not found with id: " + addressId));
    }

    private UserDTO toUserDTO(User user) {
        return UserDTO.builder()
            .id(user.getId())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .email(user.getEmail())
            .addresses(user.getAddresses().stream().map(this::toAddressDTO).toList())
            .build();
    }

    private AddressDTO toAddressDTO(Address address) {
        return AddressDTO.builder()
            .id(address.getId())
            .street(address.getStreet())
            .city(address.getCity())
            .country(address.getCountry())
            .build();
    }
}
