package com.lab.BackEnd.service;

import com.lab.BackEnd.dto.request.AdminRegistrationRequest;
import com.lab.BackEnd.dto.request.DonorRegistrationRequest;
import com.lab.BackEnd.dto.request.LoginRequest;
import com.lab.BackEnd.dto.request.NGORegistrationRequest;
import com.lab.BackEnd.dto.response.AuthResponse;
import com.lab.BackEnd.model.Admin;
import com.lab.BackEnd.model.Donor;
import com.lab.BackEnd.model.NGO;
import com.lab.BackEnd.model.User;
import com.lab.BackEnd.model.enums.UserRole;
import com.lab.BackEnd.repository.AdminRepository;
import com.lab.BackEnd.repository.DonorRepository;
import com.lab.BackEnd.repository.ngoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserService userService;

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private ngoRepository ngoRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Value("${app.admin.secret-key:SHOHAY_ADMIN_2024}")
    private String adminSecretKey;

    @Transactional
    public AuthResponse registerAdmin(AdminRegistrationRequest request) {
        if (!adminSecretKey.equals(request.getAdminKey())) {
            return new AuthResponse(null, request.getEmail(), null, null, "Invalid admin key");
        }

        if (userService.existsByEmail(request.getEmail())) {
            return new AuthResponse(null, request.getEmail(), null, null, "Email already registered");
        }

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                UserRole.ADMIN
        );
        User savedUser = userService.save(user);

        Admin admin = new Admin();
        admin.setEmail(request.getEmail());
        admin.setFullName(request.getFullName());
        admin.setUserId(savedUser.getId());
        adminRepository.save(admin);

        String token = jwtService.generateToken(savedUser);

        return new AuthResponse(
                token,
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getId(),
                "Admin registered successfully"
        );
    }

    @Transactional
    public AuthResponse registerDonor(DonorRegistrationRequest request) {
        if (userService.existsByEmail(request.getEmail())) {
            return new AuthResponse(null, request.getEmail(), null, null, "Email already registered");
        }

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                UserRole.DONOR
        );
        User savedUser = userService.save(user);

        Donor donor = new Donor();
        donor.setEmail(request.getEmail());
        donor.setFirstName(request.getFirstName());
        donor.setLastName(request.getLastName());
        donor.setPhoneNumber(request.getPhoneNumber());
        donor.setAddress(request.getAddress());
        donor.setOccupation(request.getOccupation());
        donor.setUserId(savedUser.getId());
        donorRepository.save(donor);

        String token = jwtService.generateToken(savedUser);

        return new AuthResponse(
                token,
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getId(),
                "Donor registered successfully"
        );
    }

    @Transactional
    public AuthResponse registerNGO(NGORegistrationRequest request) {
        if (userService.existsByEmail(request.getEmail())) {
            return new AuthResponse(null, request.getEmail(), null, null, "Email already registered");
        }

        if (ngoRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
            return new AuthResponse(null, request.getEmail(), null, null, "Registration number already exists");
        }

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                UserRole.NGO
        );
        User savedUser = userService.save(user);

        NGO ngo = new NGO();
        ngo.setEmail(request.getEmail());
        ngo.setRegistrationNumber(request.getRegistrationNumber());
        ngo.setOrganizationName(request.getOrganizationName());
        ngo.setContactPerson(request.getContactPerson());
        ngo.setPhoneNumber(request.getPhoneNumber());
        ngo.setAddress(request.getAddress());
        ngo.setWebsite(request.getWebsite());
        ngo.setDescription(request.getDescription());
        ngo.setFocusAreas(request.getFocusAreas());
        ngo.setUserId(savedUser.getId());
        ngoRepository.save(ngo);

        String token = jwtService.generateToken(savedUser);

        return new AuthResponse(
                token,
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getId(),
                "NGO registered successfully. Pending verification."
        );
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            User user = userService.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            userService.updateLastLogin(user.getId());

            String token = jwtService.generateToken(user);

            return new AuthResponse(
                    token,
                    user.getEmail(),
                    user.getRole(),
                    user.getId(),
                    "Login successful"
            );

        } catch (Exception e) {
            return new AuthResponse(null, request.getEmail(), null, null, "Invalid credentials");
        }
    }
}