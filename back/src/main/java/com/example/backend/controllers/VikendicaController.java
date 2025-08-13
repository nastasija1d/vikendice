package com.example.backend.controllers;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.db.VikendicaRepo;
import com.example.backend.models.Ocena;
import com.example.backend.models.Vikendica;

@RestController
@RequestMapping("/vikendica")
@CrossOrigin(origins = "http://localhost:4200")
public class VikendicaController {

    //dohvati vikendicu sa datim ID
    @GetMapping("/dohvati/{id}")
    public Vikendica dohvatiVikendicu(@PathVariable int id){
        return new VikendicaRepo().dohvatiVikendicu(id);
    }

    //dohvati sve ocene za vikendicu ID
    @GetMapping("/dohvatiocene/{id}")
    public List<Ocena> dohvatiSveOceneZaVikendicu(@PathVariable int id){
        return new VikendicaRepo().dohvatiOceneZaVikendicu(id);
    }

    //dohvati sve vikendice (search param)
    @GetMapping("/sve")
    public List<Vikendica> dohvatiSveVikendice(@RequestParam(required = false) String search) {
        return new VikendicaRepo().dohvatiSveVikendice(search);
    }

    //dohvati sve vikendice za korisnika ID
    @GetMapping("/dohvatizakorisnika/{id}")
    public List<Vikendica> dohvatiVikendiceZaKorisnika(@PathVariable String id) {
        return new VikendicaRepo().dohvatiSveVikendiceVlasnika(id);
    }

    //dodaj slike vikendici ID
    @PostMapping("/dodajslike/{id}")
    public List<String> dodajSlikeVikendici(@PathVariable int id,
            @RequestPart(value = "slike", required = false) MultipartFile[] slike) {
        List<String> putanje = new ArrayList<>();

        // Obrada slika ako postoje
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
                    String imeFajla = "vikendica_" + id + "_" + System.currentTimeMillis() + ekstenzija;
                    
                    // Čuvanje slike na disku
                    File destinacija = new File(uploadDir + imeFajla);
                    slika.transferTo(destinacija);
                    System.out.println("Slika sačuvana: " + destinacija.getAbsolutePath());
                    
                    // Čuvanje putanje u bazi
                    String relativnaPutanja = "slike/vikendice/" + imeFajla;
                    int a = new VikendicaRepo().dodajJednuSlikuZaVikendicu(id, relativnaPutanja);
                    if (a ==0) return null;
                    putanje.add(relativnaPutanja);
                    Thread.sleep(1);
                    
                } catch (IOException | InterruptedException e) {
                    e.printStackTrace();
                    continue;
                }
            }
        }
        return putanje;
    }

    //dodaj novu vikendicu u bazu podataka sa slikama
    @PostMapping(value = "/dodaj", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public int dodajVikendicu(
            @RequestParam String naziv,
            @RequestParam String mesto,
            @RequestParam String telefon,
            @RequestParam String opis,
            @RequestParam(required = false) Integer cena_leto,
            @RequestParam(required = false) Integer cena_zima,
            @RequestParam(required = false) BigDecimal x,
            @RequestParam(required = false) BigDecimal y,
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
        
        // Obrada slika ako postoje
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

    //obrisi sliku vikendice iz baze i fajl sistema
    @DeleteMapping("/obrisisliku")
    public int obrisiSliku(@RequestParam String putanja) {
        try {
            // Normalizacija putanje
            if (putanja.startsWith("/")) {
                putanja = putanja.substring(1);
            }
            
            Path fullPath = Paths.get(System.getProperty("user.dir"), "back", putanja).normalize();
            File slika = fullPath.toFile();
            
            System.out.println("Pokušavam da obrišem: " + fullPath);
            
            if (!slika.exists()) {
                System.out.println("Fajl ne postoji na lokaciji: " + fullPath);
                return 0;
            }
            
            if (!slika.canWrite()) {
                System.out.println("Nemam dozvole za brisanje: " + fullPath);
                return 0;
            }
            
            if (!slika.delete()) {
                System.out.println("Brisanje nije uspelo: " + fullPath);
                return 0;
            }
            
            return new VikendicaRepo().obrisiSliku(putanja);
            
        } catch (Exception e) {
            System.err.println("Greška pri brisanju: " + e.getMessage());
            return 0;
        }
    }

    //azuriraj podatke o vikendici ID
    @PostMapping("/azuriraj/{id}")
    public int azurirajVikendicu(
            @PathVariable int id,
            @RequestParam String naziv,
            @RequestParam String mesto,
            @RequestParam String telefon,
            @RequestParam String opis,
            @RequestParam(required = false) Integer cena_leto,
            @RequestParam(required = false) Integer cena_zima,
            @RequestParam(required = false) BigDecimal x,
            @RequestParam(required = false) BigDecimal y,
            @RequestParam String vlasnik) {
        
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
        vikendica.setId(id);

        return new VikendicaRepo().azurirajVikendicu(vikendica);
        
        
    }

}