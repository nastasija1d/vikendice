package com.example.backend.models;

public class Korisnik {
    private String username;
    private String lozinka;
    private String email;
    private String ime;
    private String prezime;
    private int pol;
    private String adresa;
    private String telefon;
    private String slika;
    private String kartica;
    private int tip;
    private int status = 0;

    // Constructor
    public Korisnik() {
        this.username = "";
        this.lozinka = "";
        this.email = "";
        this.ime = "";
        this.prezime = "";
        this.pol = 0; // Assuming 0 for unspecified
        this.adresa = "";
        this.telefon = "";
        this.slika = "";
        this.kartica = "";
        this.tip = 0; // Assuming 0 for unspecified
        this.status = 0; // Assuming 0 for inactive
    }
    public Korisnik(String username, String lozinka, String email, String ime, String prezime, int pol,
                    String adresa, String telefon, String slika, String kartica, int tip, int status) {
        this.username = username;
        this.lozinka = lozinka;
        this.email = email;
        this.ime = ime;
        this.prezime = prezime;
        this.pol = pol;
        this.adresa = adresa;
        this.telefon = telefon;
        this.slika = slika;
        this.kartica = kartica;
        this.tip = tip;
        this.status = status;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getLozinka() {
        return lozinka;
    }
    public void setLozinka(String lozinka) {
        this.lozinka = lozinka;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getIme() {
        return ime;
    }
    public void setIme(String ime) {
        this.ime = ime;
    }           
    public String getPrezime() {
        return prezime;
    }
    public void setPrezime(String prezime) {
        this.prezime = prezime;
    }
    public int getPol() {
        return pol;
    }
    public void setPol(int pol) {
        this.pol = pol;
    }
    public String getAdresa() {
        return adresa;
    }
    public void setAdresa(String adresa) {
        this.adresa = adresa;
    }
    public String getTelefon() {
        return telefon;
    }
    public void setTelefon(String telefon) {
        this.telefon = telefon;
    }
    public String getSlika() {
        return slika;
    }
    public void setSlika(String slika) {
        this.slika = slika;
    }
    public String getKartica() {
        return kartica;
    }
    public void setKartica(String kartica) {
        this.kartica = kartica;
    }
    public int getTip() {
        return tip;
    }
    public void setTip(int tip) {
        this.tip = tip;
    }
    public int getStatus() {
        return status;
    }
    public void setStatus(int status) {
        this.status = status;
    }

}