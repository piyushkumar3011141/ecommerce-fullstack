package com.ecommerce.ecommercebackend.config;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.ecommerce.ecommercebackend.entity.FooterLink;
import com.ecommerce.ecommercebackend.entity.SitePage;
import com.ecommerce.ecommercebackend.entity.User;
import com.ecommerce.ecommercebackend.repository.FooterLinkRepository;
import com.ecommerce.ecommercebackend.repository.SitePageRepository;
import com.ecommerce.ecommercebackend.repository.UserRepository;

/**
 * Pehli baar start hone par zaroori data bana deta hai:
 *  - default ADMIN account
 *  - footer links
 *  - static pages (About, Privacy, Returns ...)
 * Data pehle se hai to kuch nahi karta, isliye har baar start par safe hai.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final FooterLinkRepository footerLinkRepository;
    private final SitePageRepository sitePageRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.name}")
    private String adminName;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    public DataSeeder(
            UserRepository userRepository,
            FooterLinkRepository footerLinkRepository,
            SitePageRepository sitePageRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.footerLinkRepository = footerLinkRepository;
        this.sitePageRepository = sitePageRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedAdmin();
        seedFooter();
        seedPages();
    }

    private void seedAdmin() {
        List<User> existing = userRepository.findAllByEmailIgnoreCase(adminEmail);

        if (!existing.isEmpty()) {
            User user = existing.get(0);
            if (!user.isAdmin()) {
                user.setRole("ADMIN");
                userRepository.save(user);
                log.info("Existing user {} promoted to ADMIN", adminEmail);
            }
            return;
        }

        User admin = new User();
        admin.setName(adminName);
        admin.setEmail(adminEmail);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole("ADMIN");
        userRepository.save(admin);

        log.info("Default admin created: {}  (password application.properties me hai, zaroor badlo)", adminEmail);
    }

    private void seedFooter() {
        if (footerLinkRepository.count() > 0) {
            return;
        }

        // section, sectionOrder, sortOrder, label, path, icon
        Object[][] rows = {
            {"SHOP", 1, 1, "All Products", "/allproduct", null},
            {"SHOP", 1, 2, "Deals & Offers", "/deals", null},
            {"SHOP", 1, 3, "New Arrivals", "/newarrivals", null},
            {"SHOP", 1, 4, "Featured Products", "/featuredproducts", null},

            {"HELP", 2, 1, "Contact Us", "/contact", null},
            {"HELP", 2, 2, "FAQ", "/page/faq", null},
            {"HELP", 2, 3, "Shipping & Delivery", "/page/shipping-policy", null},
            {"HELP", 2, 4, "Returns & Refunds", "/page/returns-refunds", null},
            {"HELP", 2, 5, "Payments", "/page/payments-help", null},

            {"COMPANY", 3, 1, "About Us", "/page/about-us", null},
            {"COMPANY", 3, 2, "Careers", "/page/careers", null},
            {"COMPANY", 3, 3, "Press", "/page/press", null},

            {"POLICIES", 4, 1, "Privacy Policy", "/page/privacy-policy", null},
            {"POLICIES", 4, 2, "Terms of Use", "/page/terms-of-use", null},

            {"SOCIAL", 5, 1, "Email", "/contact", "fa-regular fa-envelope"},
            {"SOCIAL", 5, 2, "Facebook", "https://www.facebook.com", "fa-brands fa-facebook"},
            {"SOCIAL", 5, 3, "Instagram", "https://www.instagram.com", "fa-brands fa-instagram"},
            {"SOCIAL", 5, 4, "X (Twitter)", "https://x.com", "fa-brands fa-x-twitter"},
            {"SOCIAL", 5, 5, "YouTube", "https://www.youtube.com", "fa-brands fa-youtube"},

            {"BOTTOM", 6, 1, "Sell with us", "/page/sell-with-us", "fa-solid fa-store"},
            {"BOTTOM", 6, 2, "Advertise", "/page/advertise", "fa-solid fa-rectangle-ad"},
            {"BOTTOM", 6, 3, "Gift Cards", "/page/gift-cards", "fa-solid fa-gift"},
            {"BOTTOM", 6, 4, "Help Center", "/page/faq", "fa-solid fa-question"},
        };

        for (Object[] r : rows) {
            footerLinkRepository.save(new FooterLink(
                    null, (String) r[0], (Integer) r[1], (Integer) r[2],
                    (String) r[3], (String) r[4], (String) r[5]));
        }
    }

    private void seedPages() {
        if (sitePageRepository.count() > 0) {
            return;
        }

        page("about-us", "About Us", """
            E-Commerce is an online store built to make everyday shopping simple, fast and reliable.

            We bring electronics, fashion, beauty, books, home & living, sports and toys together in one place, with transparent prices, genuine reviews from real customers and quick delivery.

            Our promise: honest pricing, secure payments and support that actually replies.""");

        page("careers", "Careers", """
            We are a small, fast-moving team and we like people who enjoy building things end to end.

            We are not hiring for any open role right now, but you can still introduce yourself through the Contact Us page and we will keep your details for the future.""");

        page("press", "Press", """
            For media enquiries, interviews or brand assets, please write to us through the Contact Us page with the subject "Press" and our team will get back to you.""");

        page("faq", "Frequently Asked Questions", """
            How do I place an order?
            Add products to your cart, choose a delivery address and pick a payment method. You will see the order in My Orders straight away.

            Can I cancel my order?
            Yes. Orders can be cancelled from My Orders until they are shipped. Stock is restored and prepaid amounts are refunded.

            How do I write a review?
            Open any product page and use the review form. Reviews from customers who bought the product carry a Verified Purchase badge.

            I forgot my password. What should I do?
            Please contact us through the Contact Us page and we will help you recover your account.""");

        page("shipping-policy", "Shipping & Delivery", """
            Orders are processed within 1 business day. Standard delivery usually takes 3-7 business days depending on your location.

            Delivery is free on all orders. You can follow every step of your order (Confirmed, Processing, Shipped, Delivered) in My Orders.""");

        page("returns-refunds", "Returns & Refunds", """
            If something is not right, you can request a return within 7 days of delivery. The item must be unused and in its original packaging.

            Prepaid orders cancelled before shipping are refunded to the original payment method. Cash on Delivery orders are not charged if cancelled.""");

        page("payments-help", "Payments", """
            We accept Cash on Delivery, UPI, Credit / Debit Cards and Net Banking.

            Card details are validated securely and are never stored: we keep only the last four digits for your reference.

            Note: this demo store uses a simulated payment gateway, so no real money is charged.""");

        page("privacy-policy", "Privacy Policy", """
            We collect only the information needed to run your account and deliver your orders: your name, email, phone number and delivery addresses.

            Passwords are stored in encrypted (hashed) form and card numbers are never saved. We do not sell your personal data to anyone.

            You can ask us to update or delete your information at any time through the Contact Us page.""");

        page("terms-of-use", "Terms of Use", """
            By using this website you agree to use it lawfully and to provide accurate information when creating an account or placing an order.

            Prices and stock availability can change without notice. We may cancel an order if a product is unavailable or a pricing error occurs, and any prepaid amount will be refunded.""");

        page("sell-with-us", "Sell with us", """
            Want to sell on our store? Tell us about your products through the Contact Us page and our team will get in touch about onboarding.""");

        page("advertise", "Advertise", """
            Interested in promoting your brand on our store? Reach out through the Contact Us page with the subject "Advertising".""");

        page("gift-cards", "Gift Cards", """
            Gift cards are coming soon. Subscribe to our newsletter in the footer and we will let you know when they launch.""");
    }

    private void page(String slug, String title, String content) {
        SitePage page = new SitePage();
        page.setSlug(slug);
        page.setTitle(title);
        page.setContent(content);
        sitePageRepository.save(page);
    }
}
