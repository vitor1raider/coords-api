package com.points.coords_api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

  @Bean
  public OpenAPI openAPI() {
    return new OpenAPI()
      .info(new Info()
        .title("API de Pontos Geográficos")
        .description("API para gerenciamento de pontos geográficos e cálculo de distâncias")
        .version("1.0.0"));
    }
}