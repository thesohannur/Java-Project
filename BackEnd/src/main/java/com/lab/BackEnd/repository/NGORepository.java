package com.lab.BackEnd.repository;

import com.lab.BackEnd.model.NGO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface NGORepository extends MongoRepository<NGO, String> {

    // Your existing methods
    Optional<NGO> findByEmail(String email);
    Optional<NGO> findByUserId(String userId);
    Optional<NGO> findByRegistrationNumber(String registrationNumber);
    boolean existsByEmail(String email);
    boolean existsByRegistrationNumber(String registrationNumber);

    // New methods for donor functionality
    List<NGO> findByOrganizationNameContainingIgnoreCase(String organizationName);
    List<NGO> findByAddressContainingIgnoreCase(String address);
    List<NGO> findByOrganizationNameContainingIgnoreCaseOrAddressContainingIgnoreCase(String name, String address);
    Page<NGO> findAll(Pageable pageable);

    // Find verified NGOs (if you have a verified field)
    List<NGO> findByIsVerifiedTrue();

    // Find NGOs by city or region
    List<NGO> findByAddressContaining(String location);
}
