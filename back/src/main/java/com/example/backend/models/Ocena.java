package com.example.backend.models;

public class Ocena {
    private int broj;
    private String tekst;
    private String ime;
    private String username;

    
    public int getBroj() {
        return broj;
    }
    public String getIme() {
        return ime;
    }
    public void setIme(String ime) {
        this.ime = ime;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public void setBroj(int broj) {
        this.broj = broj;
    }
    public String getTekst() {
        return tekst;
    }
    public void setTekst(String tekst) {
        this.tekst = tekst;
    }

    
}
