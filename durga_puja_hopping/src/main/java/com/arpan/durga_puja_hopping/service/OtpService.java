package com.arpan.durga_puja_hopping.service;

import com.arpan.durga_puja_hopping.dto.GenerateOtpResponse;

public interface OtpService {
	GenerateOtpResponse generateOtpForEmail(String email);
	boolean validateOtp(String email, String otp);
}
