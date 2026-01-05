package com.arpan.durga_puja_hopping.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserRestrictedResponse {
	private Long id;
	private String email;
	private String role;
}
