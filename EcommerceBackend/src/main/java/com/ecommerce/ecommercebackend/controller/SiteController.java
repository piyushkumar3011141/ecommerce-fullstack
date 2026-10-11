package com.ecommerce.ecommercebackend.controller;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.ecommerce.ecommercebackend.dto.ContactRequest;
import com.ecommerce.ecommercebackend.entity.ContactMessage;
import com.ecommerce.ecommercebackend.entity.FooterLink;
import com.ecommerce.ecommercebackend.entity.SitePage;
import com.ecommerce.ecommercebackend.entity.Subscriber;
import com.ecommerce.ecommercebackend.repository.ContactMessageRepository;
import com.ecommerce.ecommercebackend.repository.FooterLinkRepository;
import com.ecommerce.ecommercebackend.repository.SitePageRepository;
import com.ecommerce.ecommercebackend.repository.SubscriberRepository;

/** Public site content: footer, static pages, contact form, newsletter. */
@RestController
@RequestMapping("/api/site")
public class SiteController {

    private static final Pattern EMAIL = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

    private final FooterLinkRepository footerLinkRepository;
    private final SitePageRepository sitePageRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final SubscriberRepository subscriberRepository;

    public SiteController(
            FooterLinkRepository footerLinkRepository,
            SitePageRepository sitePageRepository,
            ContactMessageRepository contactMessageRepository,
            SubscriberRepository subscriberRepository) {
        this.footerLinkRepository = footerLinkRepository;
        this.sitePageRepository = sitePageRepository;
        this.contactMessageRepository = contactMessageRepository;
        this.subscriberRepository = subscriberRepository;
    }

    // FOOTER (section order + link order ke hisaab se)
    @GetMapping("/footer")
    public List<FooterLink> footer() {
        return footerLinkRepository.findAllByOrderBySectionOrderAscSortOrderAsc();
    }

    // STATIC PAGE (about-us, privacy-policy ...)
    @GetMapping("/pages/{slug}")
    public SitePage page(@PathVariable String slug) {
        return sitePageRepository.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Page not found"));
    }

    // CONTACT FORM
    @PostMapping("/contact")
    public ResponseEntity<Map<String, String>> contact(@RequestBody ContactRequest request) {

        String name = clean(request.getName());
        String email = clean(request.getEmail());
        String message = clean(request.getMessage());

        if (name.isEmpty() || message.isEmpty() || !EMAIL.matcher(email).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name, a valid email and a message are required");
        }

        if (message.length() > 2000) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Message is too long (max 2000 characters)");
        }

        ContactMessage saved = new ContactMessage();
        saved.setName(name);
        saved.setEmail(email);
        saved.setSubject(clean(request.getSubject()));
        saved.setMessage(message);
        saved.setResolved(false);
        saved.setCreatedAt(Instant.now().toString());
        contactMessageRepository.save(saved);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Thanks! We have received your message and will reply soon."));
    }

    // NEWSLETTER (same email dobara aaye to bhi theek)
    @PostMapping("/newsletter")
    public Map<String, String> newsletter(@RequestBody Map<String, String> request) {

        String email = clean(request.get("email"));

        if (!EMAIL.matcher(email).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please enter a valid email");
        }

        if (!subscriberRepository.existsByEmailIgnoreCase(email)) {
            Subscriber subscriber = new Subscriber();
            subscriber.setEmail(email);
            subscriber.setCreatedAt(Instant.now().toString());
            subscriberRepository.save(subscriber);
        }

        return Map.of("message", "You are subscribed. Thank you!");
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }
}
