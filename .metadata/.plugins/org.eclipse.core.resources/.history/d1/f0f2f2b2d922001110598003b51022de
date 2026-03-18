package com.arpan.durga_puja_hopping.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.arpan.durga_puja_hopping.service.JwtService;
import com.arpan.durga_puja_hopping.service.UserDtlsService;
import com.arpan.durga_puja_hopping.service.impl.TokenBlacklistServiceImpl;

@Component
public class JwtFilter extends OncePerRequestFilter {
	@Autowired
	private JwtService jwtService;
	
	@Autowired
	private TokenBlacklistServiceImpl tokenBlacklistServiceImpl;
	
	@Autowired
	private UserDtlsService userDtlsService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		final String authHeader = request.getHeader("Authorization");
		String token = null;
		String email = null;

		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			token = authHeader.substring(7); // simpler: skips "Bearer "
			
			// Check if token is blacklisted
	        if (tokenBlacklistServiceImpl.isTokenBlacklisted(token)) {
	            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
	            return;
	        }
			
			try {
				email = jwtService.extractEmail(token);
			} catch (Exception e) {
				// optional: log or handle expired/invalid token
				System.out.println("JWT processing error: " + e.getMessage());
			}
		}

		if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			
			UserDetails userDetails = userDtlsService.loadUserByUsername(email);

            if (jwtService.validateToken(token, userDetails)) {

                // ✅ FIX: Use authorities directly from UserDetails (database-loaded roles)
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities() // ← critical fix
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

		filterChain.doFilter(request, response);
	}
}
