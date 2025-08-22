package com.lab.BackEnd.repository;

import com.lab.BackEnd.model.Admin;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends MongoRepository<Admin, String> {
    Optional<Admin> findByEmail(String email);
    Optional<Admin> findByUserId(String userId);
    boolean existsByEmail(String email);
}