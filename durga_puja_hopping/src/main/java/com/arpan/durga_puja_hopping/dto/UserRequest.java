package com.arpan.durga_puja_hopping.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserRequest {
	@NotBlank(message = "Email cannot be empty")
    @Email(message = "Invalid email format")
	private String email;
	
	@NotBlank(message = "Password cannot be empty")
	@Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,}$",
    message = "New password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.")
	private String password;
	
	@NotBlank(message = "OTP cannot be empty")
	private String otp;
}
