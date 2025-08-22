package com.lab.BackEnd.repository;

import com.lab.BackEnd.model.Donor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DonorRepository extends MongoRepository<Donor, String> {
    Optional<Donor> findByEmail(String email);
    Optional<Donor> findByUserId(String userId);
    boolean existsByEmail(String email);
}