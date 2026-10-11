package com.ecommerce.ecommercebackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ecommerce.ecommercebackend.security.JwtAuthenticationFilter;
import com.ecommerce.ecommercebackend.service.JwtService;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtService jwtService) throws Exception {

        // NOTE: JWT filter ko @Bean nahi banaya, warna Spring Boot usse
        // servlet filter ki tarah bhi register kar deta hai (double run).
        JwtAuthenticationFilter jwtFilter = new JwtAuthenticationFilter(jwtService);

        http
            // CORS (CorsConfig.corsConfigurationSource bean use hota hai)
            .cors(Customizer.withDefaults())

            // JWT use ho raha hai, isliye CSRF band
            .csrf(csrf -> csrf.disable())

            // Session nahi banegi
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Token nahi ya galat ho to 403 ki jagah 401 do
            .exceptionHandling(ex ->
                    ex.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))

            .authorizeHttpRequests(auth -> auth

                    // Browser preflight
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                    // Login / Signup public
                    .requestMatchers("/api/users/login", "/api/users/signup").permitAll()

                    // Products dekhna public (bina login ke shopping browse ho sake)
                    .requestMatchers(HttpMethod.GET, "/api/products", "/api/products/**").permitAll()

                    // Footer, static pages, contact form, newsletter public
                    .requestMatchers("/api/site/**").permitAll()

                    // Admin panel ki API
                    .requestMatchers("/api/admin/**").hasRole("ADMIN")

                    // Baaki saari API ke liye JWT required
                    .requestMatchers("/api/**").authenticated()

                    .anyRequest().permitAll()
            )

            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
