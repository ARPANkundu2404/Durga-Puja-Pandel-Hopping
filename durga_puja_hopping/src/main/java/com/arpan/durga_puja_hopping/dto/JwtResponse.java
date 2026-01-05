package com.arpan.durga_puja_hopping.dto;

public class JwtResponse {
	private String token;
	private String email;
	private String role;
	private String name;
	
    public JwtResponse(String token, String email, String role, String name) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.name = name;
    }

	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
}
