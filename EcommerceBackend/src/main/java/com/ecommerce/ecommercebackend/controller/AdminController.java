package com.ecommerce.ecommercebackend.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.ecommerce.ecommercebackend.dto.UserResponse;
import com.ecommerce.ecommercebackend.entity.ContactMessage;
import com.ecommerce.ecommercebackend.entity.Order;
import com.ecommerce.ecommercebackend.entity.Product;
import com.ecommerce.ecommercebackend.repository.ContactMessageRepository;
import com.ecommerce.ecommercebackend.repository.OrderRepository;
import com.ecommerce.ecommercebackend.repository.ProductRepository;
import com.ecommerce.ecommercebackend.repository.SubscriberRepository;
import com.ecommerce.ecommercebackend.repository.UserRepository;
import com.ecommerce.ecommercebackend.service.CurrentUserService;
import com.ecommerce.ecommercebackend.service.OrderService;

/**
 * Admin panel ki API. SecurityConfig me /api/admin/** par ROLE_ADMIN zaroori hai,
 * aur har method database se bhi admin check karta hai.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private static final int LOW_STOCK_LIMIT = 5;

    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderService orderService;
    private final ContactMessageRepository contactMessageRepository;
    private final SubscriberRepository subscriberRepository;

    public AdminController(
            CurrentUserService currentUserService,
            UserRepository userRepository,
            ProductRepository productRepository,
            OrderRepository orderRepository,
            OrderService orderService,
            ContactMessageRepository contactMessageRepository,
            SubscriberRepository subscriberRepository) {
        this.currentUserService = currentUserService;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.orderService = orderService;
        this.contactMessageRepository = contactMessageRepository;
        this.subscriberRepository = subscriberRepository;
    }

    // DASHBOARD NUMBERS
    @GetMapping("/stats")
    public Map<String, Object> stats() {
        currentUserService.requireAdmin();

        List<Order> orders = orderRepository.findAllByOrderByIdDesc();

        double revenue = orders.stream()
                .filter(o -> !"Cancelled".equals(o.getStatus()))
                .mapToDouble(Order::getTotal)
                .sum();

        Map<String, Long> byStatus = new LinkedHashMap<>();
        for (String status : OrderService.STATUSES) {
            byStatus.put(status, 0L);
        }
        orders.forEach(o -> byStatus.merge(o.getStatus() == null ? "Confirmed" : o.getStatus(), 1L, Long::sum));

        List<Product> lowStock = productRepository.findAll().stream()
                .filter(p -> p.getStock() <= LOW_STOCK_LIMIT)
                .limit(10)
                .toList();

        long openMessages = contactMessageRepository.findAll().stream().filter(m -> !m.isResolved()).count();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalUsers", userRepository.count());
        result.put("totalProducts", productRepository.count());
        result.put("totalOrders", orders.size());
        result.put("revenue", revenue);
        result.put("subscribers", subscriberRepository.count());
        result.put("openMessages", openMessages);
        result.put("ordersByStatus", byStatus);
        result.put("recentOrders", orders.stream().limit(5).collect(Collectors.toList()));
        result.put("lowStock", lowStock);
        return result;
    }

    // ALL ORDERS
    @GetMapping("/orders")
    public List<Order> orders() {
        currentUserService.requireAdmin();
        return orderRepository.findAllByOrderByIdDesc();
    }

    // CHANGE ORDER STATUS
    @PutMapping("/orders/{id}/status")
    public Order updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        currentUserService.requireAdmin();
        return orderService.adminUpdateStatus(id, request.get("status"));
    }

    // ALL USERS
    @GetMapping("/users")
    public List<UserResponse> users() {
        currentUserService.requireAdmin();
        return userRepository.findAll().stream().map(UserResponse::fromUser).toList();
    }

    // CONTACT MESSAGES
    @GetMapping("/messages")
    public List<ContactMessage> messages() {
        currentUserService.requireAdmin();
        return contactMessageRepository.findAllByOrderByIdDesc();
    }

    // MARK MESSAGE RESOLVED / OPEN
    @PutMapping("/messages/{id}/resolve")
    public ContactMessage toggleResolved(@PathVariable Long id) {
        currentUserService.requireAdmin();

        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Message not found"));

        message.setResolved(!message.isResolved());
        return contactMessageRepository.save(message);
    }
}
