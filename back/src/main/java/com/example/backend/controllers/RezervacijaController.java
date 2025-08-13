package com.example.backend.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.db.RezervacijaRepo;
import com.example.backend.models.OdbijanjeDTO;
import com.example.backend.models.Rezervacija;

@RestController
@RequestMapping("/rezervacije")
@CrossOrigin(origins = "http://localhost:4200")
public class RezervacijaController {

    @PostMapping("/napravi")
    public int napraviRezervaciju(@RequestBody Rezervacija rez){
        System.out.println(rez);
        return new RezervacijaRepo().napraviRezervaciju(rez);
    }

    @GetMapping("/aktivneturista/{id}")
    public List<Rezervacija> dohvatiAktivneZaTuristu(@PathVariable String id){
        return new RezervacijaRepo().dohvatiAktivneZaTuristu(id);
    }

    @GetMapping("/aktivnevlasnik/{id}")
    public List<Rezervacija> dohvatiAktivneZaVlasnika(@PathVariable String id){
        return new RezervacijaRepo().dohvatiAktivneZaVlasnika(id);
    }

    @PostMapping("/otkazi")
    public int otkaziRezervaciju(@RequestBody int id){
        return new RezervacijaRepo().otkaziRezervaciju(id);
    }

    @PostMapping("/potvrdi")
    public int potvrdiRezervaciju(@RequestBody Rezervacija id){
        return new RezervacijaRepo().potvrdiRezervaciju(id);
    }

    @PostMapping("/odbi")
    public int odbiRezervaciju(@RequestBody OdbijanjeDTO zahtev) {
        System.out.println(zahtev.getId() + " " + zahtev.getKomentar());
        return new RezervacijaRepo().odbiRezervaciju(zahtev.getId(), zahtev.getKomentar());
    }


    @PostMapping("/oceni")
    public int oceniRezervaciju(@RequestBody Rezervacija r){
        return new RezervacijaRepo().oceniRezervaciju(r);
    }

    @GetMapping("/zavikendicu/{id}")
    public List<Rezervacija> dohvatiSveRezervacijeZaDatuVikendicu(@PathVariable int id){
        return new RezervacijaRepo().dohvatiSveZaVikendicu(id);
    }
    
}
