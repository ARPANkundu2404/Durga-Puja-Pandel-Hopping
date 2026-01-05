package com.arpan.durga_puja_hopping.service;

import com.arpan.durga_puja_hopping.dto.EmailDetails;

public interface EmailService {
	String sendSimpleEmail(EmailDetails ed);
	String sendEmailWithAttachment(EmailDetails ed);
}
