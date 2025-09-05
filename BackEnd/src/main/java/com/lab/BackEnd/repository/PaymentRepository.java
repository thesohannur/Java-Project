package com.lab.BackEnd.repository;

import com.lab.BackEnd.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {

    List<Payment> findByDonorId(String donorId);
    List<Payment> findByNgoId(String ngoId);

    // Additional methods for better payment tracking
    List<Payment> findByStatus(String status);
    List<Payment> findByDonorIdAndStatus(String donorId, String status);
    List<Payment> findByNgoIdAndStatus(String ngoId, String status);
    List<Payment> findByTimestampBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Payment> findByTimestampAfterOrderByTimestampDesc(LocalDateTime since);
}
