package com.example.backend.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.db.KorisnikRepo;
import com.example.backend.db.VikendicaRepo;
import com.example.backend.models.Korisnik;
import com.example.backend.models.LoginInfo;
import com.example.backend.models.Vikendica;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    @GetMapping("/svizahtevi")
    public List<Korisnik> dohvatiSveNoveZahteve(){
        return new KorisnikRepo().dohvaiSveZahteve();
    }
    
    @PostMapping("/prihvati")
    public int prihvatiZahtev(@RequestBody String username){
        return new KorisnikRepo().potvrdiZahtev(username);
    }

    @PostMapping("/odbi")
    public int odbiZahtev(@RequestBody String username){
        return new KorisnikRepo().odbiZahtev(username);
    }

    @PostMapping("/blokiraj")
    public int blokirajKorisnika(@RequestBody String username){
        return new KorisnikRepo().blokirajKorisnika(username);
    }

    @GetMapping("/svikorisnici")
    public List<Korisnik> dohvatiSveKorisnike(){
        return new KorisnikRepo().dohvatiSveKorisnike();
    }

    @GetMapping("/svevikendice")
    public List<Vikendica> dohvatiSveVikendice(){
        return new VikendicaRepo().dohvatiSveVikendiceZaAdmina();
    }

    @PostMapping("/blokirajvikendicu")
    public int blokirajVikendicu(@RequestBody int id){
        return new VikendicaRepo().blokirajVikendicu(id);
    }

    @PostMapping("/login")
    public Korisnik login(@RequestBody LoginInfo loginDTO) {
        System.out.println("LOGIN ADMIN: " + loginDTO.getUsername() + ", " + loginDTO.getLozinka());
        return  new KorisnikRepo().loginAdmin(loginDTO.getUsername(), loginDTO.getLozinka());
    } 
}

