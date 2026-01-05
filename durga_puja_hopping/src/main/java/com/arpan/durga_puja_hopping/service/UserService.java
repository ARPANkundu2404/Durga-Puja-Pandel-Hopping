package com.arpan.durga_puja_hopping.service;

import com.arpan.durga_puja_hopping.dto.LoginRequest;
import com.arpan.durga_puja_hopping.dto.UserAddRequest;
import com.arpan.durga_puja_hopping.dto.UserRequest;
import com.arpan.durga_puja_hopping.entity.UserDtls;

public interface UserService {
	String login(LoginRequest loginRequest);
	UserDtls registerUser(UserAddRequest request);
	String updatePassword(UserRequest request);
	UserDtls getUserByEmail(String email);
}
