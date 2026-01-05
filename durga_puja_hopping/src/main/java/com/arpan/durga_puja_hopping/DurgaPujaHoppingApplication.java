package com.arpan.durga_puja_hopping;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DurgaPujaHoppingApplication implements CommandLineRunner {
	
	private static final Logger logger = LoggerFactory.getLogger(DurgaPujaHoppingApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(DurgaPujaHoppingApplication.class, args);
		logger.info("\nDurgaPujaHoppingApplication successfully started...");
	}
	

	@Override
	public void run(String... args) throws Exception {
		logger.info("\nHello! form DurgaPujaHoppingApplication CommandLineRunner...");
	}

}
