package com.lab.BackEnd.repository;

import com.lab.BackEnd.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {

    List<Payment> findByDonorId(String donorId);

    List<Payment> findByNgoId(String ngoId);
}
