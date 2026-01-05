package com.arpan.durga_puja_hopping.exception;

public class ResourceNotFoundException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public ResourceNotFoundException(String msg) {
		super(msg);
	}
}
