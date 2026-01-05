package com.arpan.durga_puja_hopping.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition (
		info=@Info (
				title = "Durga Puja Hopping API",
				description = "API endpoints for User Authentication, OTP, and Password Management for the Durga Puja Hopping application.",
				contact = @Contact (
						name = "Arpan Kundu",
						email = "kunduarpan2404@gmail.com"
				),
				version = "1.0.0"
		),
		servers = {
				@Server (
					description = "DEV",
					url = "http://localhost:8080"
				),
				@Server (
					description = "UAT",
					url = "http://localhost:8081"
				),
				@Server (
					description = "PROD",
					url = "http://localhost:8082"
				)
		}
)

public class OpenAPIConfig {
	@Bean
    public OpenAPI customizeOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
            .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
            .components(new Components()
                .addSecuritySchemes(securitySchemeName,
                    new SecurityScheme()
                        .name(securitySchemeName)
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")));
    }
}
