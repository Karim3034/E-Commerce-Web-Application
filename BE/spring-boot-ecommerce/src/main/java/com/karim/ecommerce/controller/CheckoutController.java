package com.karim.ecommerce.controller;

import com.karim.ecommerce.dto.Purchase;
import com.karim.ecommerce.dto.PurchaseResponse;
import com.karim.ecommerce.service.CheckoutService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/checkout")
public class CheckoutController {

    CheckoutService checkoutService;

    CheckoutController(CheckoutService checkoutService){
        this.checkoutService = checkoutService;
    }
    @PostMapping("/purchase")
    PurchaseResponse purchase(@RequestBody Purchase purchase){
        return this.checkoutService.placeOrder(purchase);
    }

}
