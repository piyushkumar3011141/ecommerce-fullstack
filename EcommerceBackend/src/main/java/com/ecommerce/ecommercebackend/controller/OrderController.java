package com.ecommerce.ecommercebackend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.ecommerce.ecommercebackend.dto.OrderRequest;
import com.ecommerce.ecommercebackend.entity.Order;
import com.ecommerce.ecommercebackend.entity.User;
import com.ecommerce.ecommercebackend.service.CurrentUserService;
import com.ecommerce.ecommercebackend.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final CurrentUserService currentUserService;

    public OrderController(OrderService orderService, CurrentUserService currentUserService) {
        this.orderService = orderService;
        this.currentUserService = currentUserService;
    }

    // PLACE ORDER (+ payment). Order logged-in user ke naam par banta hai.
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest request) {
        Order saved = orderService.createOrder(currentUserService.requireUser(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // MY ORDERS
    @GetMapping
    public List<Order> getMyOrders() {
        return orderService.getUserOrders(currentUserService.requireUser());
    }

    // MY ORDERS (email wala URL, sirf apni email chalegi)
    @GetMapping("/user/{email}")
    public List<Order> getOrdersByUser(@PathVariable String email) {

        User current = currentUserService.requireUser();

        if (current.getEmail() == null || !current.getEmail().equalsIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only view your own orders");
        }

        return orderService.getUserOrders(current);
    }

    // CANCEL (sirf Confirmed / Processing)
    @PutMapping("/{id}/cancel")
    public Order cancelOrder(@PathVariable Long id) {
        return orderService.cancelOrder(currentUserService.requireUser(), id);
    }

    // DELETE (sirf cancelled / delivered order)
    @DeleteMapping("/{id}")
    public Map<String, String> deleteOrder(@PathVariable Long id) {
        orderService.delete(currentUserService.requireUser(), id);
        return Map.of("message", "Order deleted successfully");
    }
}
