package com.lab.BackEnd.service;
import org.springframework.stereotype.Service;
import java.util.Random;

@Service
public class PaymentService {

    private final Random random = new Random();

    public boolean processPayment(String userId, double amount) {
        try {
            Thread.sleep(500 + new Random().nextInt(500)); // 0.5-1s delay
        } catch (InterruptedException e) {
            e.printStackTrace();
        }


        double chance = new Random().nextDouble();
        return chance < 0.9; // 90% success
    }
}
