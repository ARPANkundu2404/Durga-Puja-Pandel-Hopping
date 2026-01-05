package com.arpan.durga_puja_hopping.service;

import java.time.LocalDateTime;

public interface TokenBlacklistService {
	void blacklistToken(String token, LocalDateTime expiryDate);
	boolean isTokenBlacklisted(String token);
	void removeExpiredTokens();
}
