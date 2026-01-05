package com.arpan.durga_puja_hopping.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.arpan.durga_puja_hopping.entity.UserDtls;
import com.arpan.durga_puja_hopping.repository.UserDtlsRepository;

@Service
public class UserDtlsService implements UserDetailsService {
    
    @Autowired
    private UserDtlsRepository userDtlsRepository;

    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // username refers to the user's email here
        UserDtls userDtls = userDtlsRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Invalid username/email!"));

        // Since UserDtls implements UserDetails, return it directly
        return userDtls;
    }
}
