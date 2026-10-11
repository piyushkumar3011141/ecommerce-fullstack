# E-Commerce Full-Stack Application

A complete online store: **React** storefront + **Spring Boot** REST API + **MySQL**, with JWT authentication, role-based access (customer / admin), server-side cart & wishlist, orders with a payment flow, product reviews & ratings, an admin dashboard and a database-driven footer.

> Two folders: `e-commerce/` (React frontend) and `EcommerceBackend/` (Spring Boot backend).

---

## Features

**Customer**
- Sign up / login with JWT (BCrypt-hashed passwords), edit profile, change password
- Browse, search, filter and sort products; category pages; deals, featured and new arrivals
- Product details with **reviews & star ratings** (one review per user, "Verified purchase" badge, edit/delete)
- **Cart and wishlist saved per user on the server**; guest cart/wishlist is merged automatically after login
- Address book, checkout and **payments**: Cash on Delivery, UPI, Credit/Debit Card (Luhn + expiry validation), Net Banking
- Orders with live status tracking; **cancel order** (stock is restored, prepaid amount marked refunded)
- Fully responsive (mobile / tablet / desktop)

**Admin panel (`/admin`)**
- Dashboard: revenue, orders, customers, subscribers, orders-by-status, low-stock alerts, recent orders
- Products: add / edit / delete, search, import sample catalogue
- Orders: all customers' orders, change status (Confirmed → Processing → Shipped → Delivered / Cancelled)
- Users list with roles; inbox for **Contact Us** messages (mark resolved)

**Site content from the database**
- Footer links, About / FAQ / Privacy / Terms / Returns pages, contact form, newsletter sign-up

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router, Axios, Bootstrap 5, Vite |
| Backend | Java, Spring Boot (Web MVC, Data JPA, Security), JJWT, Lombok |
| Database | MySQL (Hibernate `ddl-auto=update`) |

## Architecture

```
React (Vite)  ──HTTP/JSON + Bearer JWT──▶  Spring Boot REST API  ──JPA──▶  MySQL
 contexts: Auth, Products, Cart,            JwtAuthenticationFilter → SecurityFilterChain
 Wishlist, Orders, Toast                    controllers → services → repositories
```

Backend packages: `config` (security, CORS, data seeding) · `controller` · `service` · `repository` · `entity` · `dto` · `security`.

### Security highlights
- Stateless JWT (24 h) carrying user id + role; BCrypt password hashing; passwords never serialised in responses
- Ownership checks: users can only read/modify **their own** cart, wishlist, addresses and orders
- `ROLE_ADMIN` required for `/api/admin/**` and product create/update/delete (also re-checked against the database)
- Order **prices and stock are always taken from the server**, never trusted from the client; order + payment + stock update run in **one transaction** (any failure rolls everything back)
- Card number and CVV are never stored (only the last 4 digits)
- Signup can never create an admin; the admin account is created by configuration

## Getting started

**Requirements:** Java 17+, Maven, MySQL, Node 18+

### 1. Backend
```bash
cd EcommerceBackend
# edit src/main/resources/application.properties -> MySQL username/password
./mvnw spring-boot:run          # starts on http://localhost:8080
```
The database `ecommerce_db`, the admin account, footer links and static pages are created automatically on first start.

**Default admin** (change it in `application.properties`!):  `admin@ecommerce.com` / `Admin@123`

### 2. Frontend
```bash
cd e-commerce
npm install
npm run dev                     # http://localhost:5173
```
Optional: copy `.env.example` to `.env` to change the API URL.

### 3. Load products (first time)
Login as admin → **Admin panel → Products → Import sample products** (102 products).

### Test payments (simulated gateway - no real money)
| Method | Success | Declined |
|---|---|---|
| Card | `4111 1111 1111 1111`, any future expiry, any CVV | `4000 0000 0000 0002` |
| UPI | `name@bank` | `fail@upi` |

## REST API (summary)

| Area | Endpoints | Access |
|---|---|---|
| Auth | `POST /api/users/signup`, `POST /api/users/login` | public |
| Profile | `GET /api/users/me`, `PUT /api/users/{id}` | user |
| Products | `GET /api/products`, `GET /api/products/{id}` | public |
| Products (manage) | `POST /api/products`, `POST /api/products/bulk`, `PUT/DELETE /api/products/{id}` | admin |
| Reviews | `GET /api/products/{id}/reviews` (public), `POST /api/products/{id}/reviews`, `DELETE /api/reviews/{id}` | user |
| Cart | `GET/POST/DELETE /api/cart`, `PUT/DELETE /api/cart/{cartId}` | user |
| Wishlist | `GET /api/wishlist`, `POST/DELETE /api/wishlist/{productId}` | user |
| Addresses | `GET/POST /api/addresses`, `PUT/DELETE /api/addresses/{id}` | user |
| Orders | `POST /api/orders` (with payment), `GET /api/orders`, `PUT /api/orders/{id}/cancel`, `DELETE /api/orders/{id}` | user |
| Admin | `GET /api/admin/stats`, `/orders`, `/users`, `/messages`, `PUT /api/admin/orders/{id}/status`, `PUT /api/admin/messages/{id}/resolve` | admin |
| Site | `GET /api/site/footer`, `GET /api/site/pages/{slug}`, `POST /api/site/contact`, `POST /api/site/newsletter` | public |

## Tests
```bash
cd EcommerceBackend && ./mvnw -Dtest=PaymentServiceTest test    # payment validation unit tests
```
(`EcommerceBackendApplicationTests` needs a running MySQL.)

## Notes / possible next steps
- The payment gateway is simulated (`PaymentService`); swap `charge()` for Razorpay/Stripe to go live.
- Move `app.jwt.secret` and DB credentials to environment variables for deployment.
- Ideas: email notifications, product image upload, pagination for admin tables, Docker Compose.

---

### Resume bullets (copy / adapt)
- Built a full-stack e-commerce platform with **React, Spring Boot, MySQL** and **JWT** authentication with role-based access (customer/admin).
- Designed **15+ REST endpoints** (cart, wishlist, orders, reviews, payments, admin) with server-side validation, ownership checks and transactional order processing (stock + payment rollback).
- Implemented a **payment module** (UPI / card with Luhn & expiry validation / net banking / COD), order cancellation with stock restore and refunds.
- Developed an **admin dashboard** (sales stats, low-stock alerts, product CRUD, order management, support inbox) and a **responsive** storefront for mobile, tablet and desktop.
