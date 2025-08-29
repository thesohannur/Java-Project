package com.lab.BackEnd.repository;

import com.lab.BackEnd.model.NGO;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NGORepository extends MongoRepository<NGO, String> {
    Optional<NGO> findByEmail(String email);
    Optional<NGO> findByUserId(String userId);
    Optional<NGO> findByRegistrationNumber(String registrationNumber);
    boolean existsByEmail(String email);
    boolean existsByRegistrationNumber(String registrationNumber);
}