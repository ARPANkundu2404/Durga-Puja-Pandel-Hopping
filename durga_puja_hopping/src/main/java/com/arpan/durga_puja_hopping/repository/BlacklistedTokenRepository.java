package com.arpan.durga_puja_hopping.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.arpan.durga_puja_hopping.entity.BlacklistedToken;

import java.time.LocalDateTime;
import java.util.Optional;

public interface BlacklistedTokenRepository extends JpaRepository<BlacklistedToken, Long> {
	Optional<BlacklistedToken> findByToken(String token);
	void deleteByExpiryDateBefore(LocalDateTime now);
}
