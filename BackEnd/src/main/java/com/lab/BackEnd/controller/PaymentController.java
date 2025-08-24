package com.lab.BackEnd.controller;

import com.lab.BackEnd.service.PaymentService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    public boolean processPayment(String userId, double amount) {
        return paymentService.processPayment(userId, amount);
    }
}
