package com.ecommerce.ecommercebackend.service;

import java.time.Instant;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ecommerce.ecommercebackend.dto.OrderRequest;
import com.ecommerce.ecommercebackend.entity.Order;
import com.ecommerce.ecommercebackend.entity.OrderItem;
import com.ecommerce.ecommercebackend.entity.Product;
import com.ecommerce.ecommercebackend.entity.User;
import com.ecommerce.ecommercebackend.repository.OrderRepository;
import com.ecommerce.ecommercebackend.repository.ProductRepository;

@Service
public class OrderService {

    // Admin in statuses me order ko le ja sakta hai
    public static final List<String> STATUSES =
            List.of("Confirmed", "Processing", "Shipped", "Delivered", "Cancelled");

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final PaymentService paymentService;

    public OrderService(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            PaymentService paymentService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.paymentService = paymentService;
    }

    // PLACE ORDER: stock check -> payment -> order save (kuch bhi fail hua to sab rollback)
    @Transactional
    public Order createOrder(User user, OrderRequest request) {

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order has no items");
        }

        Order order = new Order();
        order.setUser(user);
        order.setCustomerEmail(user.getEmail());
        order.setCustomerName(request.getCustomerName());
        order.setCustomerCity(request.getCustomerCity());
        order.setStatus("Confirmed");
        order.setOrderDate(Instant.now().toString());
        order.setOrderNumber(
                request.getOrderNumber() != null && !request.getOrderNumber().isBlank()
                        ? request.getOrderNumber()
                        : "ORD" + System.currentTimeMillis());

        double total = 0;

        for (OrderItem requested : request.getItems()) {

            if (requested.getQuantity() < 1) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid quantity");
            }

            OrderItem item = new OrderItem();
            item.setProductId(requested.getProductId());
            item.setProductName(requested.getProductName());
            item.setImage(requested.getImage());
            item.setQuantity(requested.getQuantity());
            item.setPrice(requested.getPrice());

            // Product id mila to price aur stock server se hi lete hain (client ka price bharosemand nahi)
            if (requested.getProductId() != null) {

                Product product = productRepository.findById(requested.getProductId())
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND, "Product no longer exists: " + requested.getProductName()));

                if (product.getStock() < requested.getQuantity()) {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT, "Not enough stock for " + product.getName());
                }

                product.setStock(product.getStock() - requested.getQuantity());
                productRepository.save(product);

                item.setProductName(product.getName());
                item.setImage(product.getImage());
                item.setPrice(product.getPrice());
            }

            total += item.getPrice() * item.getQuantity();
            order.getItems().add(item);
        }

        order.setTotal(total);

        // Payment (fail hone par exception -> upar ka stock change bhi rollback ho jata hai)
        PaymentService.PaymentResult result =
                paymentService.charge(request.getPayment(), request.getPaymentDetails(), total);

        order.setPayment(result.label());
        order.setPaymentStatus(result.status());
        order.setTransactionId(result.transactionId());

        Order saved = orderRepository.save(order);
        paymentService.record(user, saved, result);

        return saved;
    }

    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUserOrderByIdDesc(user);
    }

    // CUSTOMER: sirf Confirmed / Processing order cancel kar sakta hai
    @Transactional
    public Order cancelOrder(User user, Long id) {

        Order order = findOwnedOrder(user, id);

        if (!"Confirmed".equals(order.getStatus()) && !"Processing".equals(order.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "This order can no longer be cancelled (" + order.getStatus() + ")");
        }

        return applyStatus(order, "Cancelled");
    }

    // ADMIN: kisi bhi order ka status badal sakta hai
    @Transactional
    public Order adminUpdateStatus(Long id, String status) {

        if (status == null || !STATUSES.contains(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status");
        }

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if ("Cancelled".equals(order.getStatus()) && !"Cancelled".equals(status)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A cancelled order cannot be reopened");
        }

        return applyStatus(order, status);
    }

    // Status badalne ka common logic (stock wapas, payment status sync)
    private Order applyStatus(Order order, String newStatus) {

        String old = order.getStatus();

        if (newStatus.equals(old)) {
            return order;
        }

        if ("Cancelled".equals(newStatus)) {
            // Stock wapas
            for (OrderItem item : order.getItems()) {
                if (item.getProductId() != null) {
                    productRepository.findById(item.getProductId()).ifPresent(p -> {
                        p.setStock(p.getStock() + item.getQuantity());
                        productRepository.save(p);
                    });
                }
            }

            String paymentStatus = "PAID".equals(order.getPaymentStatus()) ? "REFUNDED" : "CANCELLED";
            order.setPaymentStatus(paymentStatus);
            paymentService.updateStatus(order.getId(), paymentStatus);
        }

        // COD ka paisa delivery par milta hai
        if ("Delivered".equals(newStatus) && "PENDING".equals(order.getPaymentStatus())) {
            order.setPaymentStatus("PAID");
            paymentService.updateStatus(order.getId(), "PAID");
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    @Transactional
    public void delete(User user, Long id) {
        Order order = findOwnedOrder(user, id);

        // Chalu order delete nahi hota, pehle cancel karo
        if (!"Cancelled".equals(order.getStatus()) && !"Delivered".equals(order.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cancel the order before deleting it");
        }

        orderRepository.delete(order);
    }

    private Order findOwnedOrder(User user, Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (order.getUser() == null || !order.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This order is not yours");
        }
        return order;
    }
}
