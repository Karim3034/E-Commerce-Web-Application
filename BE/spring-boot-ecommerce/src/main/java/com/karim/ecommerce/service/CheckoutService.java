package com.karim.ecommerce.service;

import com.karim.ecommerce.dto.Purchase;
import com.karim.ecommerce.dto.PurchaseResponse;


public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}
