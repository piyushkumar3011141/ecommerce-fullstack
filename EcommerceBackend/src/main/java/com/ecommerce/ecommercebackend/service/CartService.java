package com.ecommerce.ecommercebackend.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ecommerce.ecommercebackend.entity.Cart;
import com.ecommerce.ecommercebackend.entity.Product;
import com.ecommerce.ecommercebackend.entity.User;
import com.ecommerce.ecommercebackend.repository.CartRepository;
import com.ecommerce.ecommercebackend.repository.ProductRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    // GET USER CART
    public List<Cart> getUserCart(User user) {
        return cartRepository.findByUser(user);
    }

    // ADD TO CART (product pehle se cart me hai to quantity badh jaati hai)
    @Transactional
    public Cart addToCart(User user, Long productId, int quantity) {

        if (quantity < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be at least 1");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        if (product.getStock() <= 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Product is out of stock");
        }

        Cart cart = cartRepository.findByUserAndProduct(user, product).orElseGet(() -> {
            Cart c = new Cart();
            c.setUser(user);
            c.setProduct(product);
            c.setQuantity(0);
            return c;
        });

        // Stock se zyada quantity cart me nahi jayegi
        cart.setQuantity(Math.min(cart.getQuantity() + quantity, product.getStock()));

        return cartRepository.save(cart);
    }

    // UPDATE QUANTITY
    @Transactional
    public Cart updateQuantity(User user, Long cartId, int quantity) {

        if (quantity < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be at least 1");
        }

        Cart cart = findOwnedCart(user, cartId);

        cart.setQuantity(Math.min(quantity, Math.max(cart.getProduct().getStock(), 1)));

        return cartRepository.save(cart);
    }

    // REMOVE ONE ITEM
    @Transactional
    public void removeCartItem(User user, Long cartId) {
        cartRepository.delete(findOwnedCart(user, cartId));
    }

    // CLEAR WHOLE CART
    @Transactional
    public void clearCart(User user) {
        cartRepository.deleteAll(cartRepository.findByUser(user));
    }

    private Cart findOwnedCart(User user, Long cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));

        if (cart.getUser() == null || !cart.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This cart item is not yours");
        }
        return cart;
    }
}
