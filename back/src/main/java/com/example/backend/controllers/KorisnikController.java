package com.example.backend.controllers;

import java.io.File;
import java.io.IOException;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.db.KorisnikRepo;
import com.example.backend.models.Korisnik;
import com.example.backend.models.LoginInfo;
import com.example.backend.models.PromenaLozinkeInfo;

@RestController
@RequestMapping("/korisnik")
@CrossOrigin(origins = "http://localhost:4200")
public class KorisnikController {

    @PostMapping("/login")
    public Korisnik login(@RequestBody LoginInfo loginDTO) {
        return  new KorisnikRepo().login(loginDTO.getUsername(), loginDTO.getLozinka());
    }   
    
    @PostMapping("/registruj")
    public int registruj(
            @RequestPart("korisnik") Korisnik korisnik,
            @RequestPart(value = "slika", required = false) MultipartFile slika) {

        String imeFajla = "default.png";

        if (slika != null && !slika.isEmpty()) {
            try {
                String rootPath = System.getProperty("user.dir");  // na primer /Users/tvojkorisnik/projekat
                String uploadDir = rootPath + File.separator + "back" + File.separator + "slike" + File.separator + "korisnici" + File.separator;

                File folder = new File(uploadDir);
                if (!folder.exists()) folder.mkdirs();
                String originalIme = slika.getOriginalFilename();
                String ekstenzija = "";
                if (originalIme != null && originalIme.contains(".")) {
                    ekstenzija = originalIme.substring(originalIme.lastIndexOf("."));
                }

                imeFajla = korisnik.getUsername() + "_" + System.currentTimeMillis() + ekstenzija;
                File destinacija = new File(uploadDir + imeFajla);
                slika.transferTo(destinacija);

            } catch (IOException e) {
                e.printStackTrace();
                return 0;
            }
        }
        korisnik.setSlika("slike/korisnici/" + imeFajla);
        return new KorisnikRepo().registruj(korisnik);
    }

    @PostMapping("/promeniLozinku")
    public int promeniLozinku(@RequestBody PromenaLozinkeInfo dto) {
        //System.out.println("Promena lozinke: " + dto.username + ", " + dto.staraLozinka + ", " + dto.novaLozinka);
        return new KorisnikRepo().promeniLozinku(dto.username, dto.staraLozinka, dto.novaLozinka);
    }

    @PostMapping("/izmeniProfil")
    public Korisnik izmeniProfil(
        @RequestParam("username") String username,
        @RequestParam("ime") String ime,
        @RequestParam("prezime") String prezime,
        @RequestParam("adresa") String adresa,
        @RequestParam("telefon") String telefon,
        @RequestParam("email") String email,
        @RequestParam("kartica") String kartica,
        @RequestParam(value = "slika", required = false) MultipartFile slika
    ) {
        System.out.println("Izmena profila: " + username + ", " + ime + ", " + prezime + ", " + adresa + ", " + telefon + ", " + email + ", " + kartica);
        return new KorisnikRepo().izmeniPodatke(username, ime, prezime, adresa, telefon, email, kartica, slika);
    }

    @GetMapping("/dohvati/{id}")
    public Korisnik dohvatiKorisnika(@PathVariable String id){
        return new KorisnikRepo().dohvatiKorisnika(id);
    }



    
}
