package com.karim.ecommerce.dto;

import com.karim.ecommerce.entity.Address;
import com.karim.ecommerce.entity.Customer;
import com.karim.ecommerce.entity.Order;
import com.karim.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;

    private Address shippingAddress;

    private Address billingAddress;

    private Order order;

    private Set<OrderItem> orderItems;
}
