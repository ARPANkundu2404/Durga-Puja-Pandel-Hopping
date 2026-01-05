package com.arpan.durga_puja_hopping.exception;

public class TooManyRequestsException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public TooManyRequestsException(String msg) {
		super(msg);
	}
}
