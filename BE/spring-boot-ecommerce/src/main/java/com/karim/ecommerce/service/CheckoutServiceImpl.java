package com.karim.ecommerce.service;

import com.karim.ecommerce.dao.CustomerRepository;
import com.karim.ecommerce.dto.Purchase;
import com.karim.ecommerce.dto.PurchaseResponse;
import com.karim.ecommerce.entity.Customer;
import com.karim.ecommerce.entity.Order;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{
    CustomerRepository customerRepository;
    CheckoutServiceImpl(CustomerRepository customerRepository){
        this.customerRepository = customerRepository;
    }
    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        //retrieve order from dto
        Customer customer = purchase.getCustomer();
        Order order = purchase.getOrder();
        purchase.getOrderItems().forEach(order::add);
        order.setShippingAddress(purchase.getBillingAddress());
        order.setBillingAddress(purchase.getShippingAddress());
        Customer theCustomer = customerRepository.findByEmail(customer.getEmail());
        if(theCustomer!=null) {
            customer = theCustomer;
        }
        customer.add(order);
        customerRepository.save(customer);
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}
