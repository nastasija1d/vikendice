package com.example.backend.config;

import java.io.File;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class Slika implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        System.out.println("APSOLUTNA PUTANJA: " + new File("slike").getAbsolutePath());

        registry.addResourceHandler("/slike/**")
                .addResourceLocations("file:back/slike/");
    }
}
