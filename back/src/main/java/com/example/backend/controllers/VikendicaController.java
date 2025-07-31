package com.example.backend.controllers;

import java.io.File;
import java.io.IOException;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.db.VikendicaRepo;
import com.example.backend.models.Vikendica;

@RestController
@RequestMapping("/vikendica")
@CrossOrigin(origins = "http://localhost:4200")
public class VikendicaController {

    @PostMapping(value = "/dodaj", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public int dodajVikendicu(
            @RequestParam String naziv,
            @RequestParam String mesto,
            @RequestParam String telefon,
            @RequestParam String opis,
            @RequestParam(required = false) Integer cena_leto,
            @RequestParam(required = false) Integer cena_zima,
            @RequestParam(required = false) Double x,
            @RequestParam(required = false) Double y,
            @RequestParam String vlasnik,
            @RequestPart(value = "slike", required = false) MultipartFile[] slike) {
        
        Vikendica vikendica = new Vikendica();
        vikendica.setNaziv(naziv);
        vikendica.setMesto(mesto);
        vikendica.setTelefon(telefon);
        vikendica.setOpis(opis);
        vikendica.setCenaLeto(cena_leto);
        vikendica.setCenaZima(cena_zima);
        vikendica.setX(x);
        vikendica.setY(y);
        vikendica.setVlasnik(vlasnik);

        int idVik = new VikendicaRepo().dodajNovuVikendicu(vikendica);
        
        // 2. Obrada slika ako postoje
        if (slike != null && slike.length > 0) {
            String rootPath = System.getProperty("user.dir");
            String uploadDir = rootPath + File.separator + "back" + File.separator + "slike" + 
                            File.separator + "vikendice" + File.separator;

            // Kreiranje foldera ako ne postoji
            File folder = new File(uploadDir);
            if (!folder.exists()) {
                folder.mkdirs();
            }

            for (MultipartFile slika : slike) {
                if (slika == null || slika.isEmpty()) {
                    continue; 
                }
                try {
                    String originalIme = slika.getOriginalFilename();
                    String ekstenzija = originalIme != null && originalIme.contains(".") ? 
                                        originalIme.substring(originalIme.lastIndexOf(".")) : "";
                    String imeFajla = "vikendica_" + idVik + "_" + System.currentTimeMillis() + ekstenzija;
                    
                    // Čuvanje slike na disku
                    File destinacija = new File(uploadDir + imeFajla);
                    slika.transferTo(destinacija);
                    
                    // Čuvanje putanje u bazi
                    String relativnaPutanja = "slike/vikendice/" + imeFajla;
                    int a = new VikendicaRepo().dodajJednuSlikuZaVikendicu(idVik, relativnaPutanja);
                    if (a ==0) return 0;
                    Thread.sleep(1);
                    
                } catch (IOException | InterruptedException e) {
                    e.printStackTrace();
                    continue;
                }
            }
        }
        return idVik;
    }
}

    

