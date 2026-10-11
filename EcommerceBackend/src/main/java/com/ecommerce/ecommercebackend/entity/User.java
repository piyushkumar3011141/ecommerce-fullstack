package com.ecommerce.ecommercebackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    // Password sirf request me aa sakta hai, response me kabhi nahi jayega
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String phone;

    // "USER" (default) ya "ADMIN". Purane users me null hota hai, wo USER maane jaate hain.
    // Role request se kabhi set nahi hota (signup par hamesha USER).
    @JsonIgnore
    private String role;

    @JsonIgnore
    public boolean isAdmin() {
        return "ADMIN".equals(role);
    }
}
