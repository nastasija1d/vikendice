package com.example.backend;

import java.io.File;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		System.out.println("STARTUJEM IZ: " + new File(".").getAbsolutePath());

		SpringApplication.run(BackendApplication.class, args);
	}

}
