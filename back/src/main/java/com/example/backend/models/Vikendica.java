package com.example.backend.models;

public class Vikendica {
    private int id;
    private String vlasnik;
    private String naziv;
    private String mesto;
    private String opis;
    private String telefon;
    private Integer cena_leto;
    private Integer cena_zima;
    private Double x;
    private Double y;
    private String[] slike;    

    public Vikendica(int id, String vlasnik, String naziv, String mesto, 
    String opis,String telefon, Integer cena_leto, Integer cena_zima, Double x, Double y, String[] slike) {
        this.id = id;
        this.vlasnik = vlasnik;
        this.naziv = naziv;
        this.mesto = mesto;
        this.opis = opis;
        this.cena_leto = cena_leto;
        this.cena_zima = cena_zima;
        this.x = x;
        this.y = y;
        this.slike = slike;
        this.telefon= telefon;
    }

    public Vikendica(){
        this.id = 0;
        this.vlasnik = "";
        this.naziv = "";
        this.mesto = "";
        this.opis = "";
        this.telefon = "";
        this.cena_leto = 0;
        this.cena_zima = 0;
        this.x = 0.0;
        this.y = 0.0;
        this.slike = new String[0];
    }
    
    public int getId() {
        return id;
    }
    public String getVlasnik() {
        return vlasnik;
    }
    public String getNaziv() {
        return naziv;
    }
    public String getMesto() {
        return mesto;
    }
    public String getOpis() {
        return opis;
    }
    public Integer getCenaLeto() {
        return cena_leto;
    }
    public Integer getCenaZima() {
        return cena_zima;
    }
    public Double getX() {
        return x;
    }
    public Double getY() {
        return y;
    }
    public String[] getSlike() {
        return slike;
    } 
    public String getTelefon() {
        return telefon;
    } 
    
    // Setters
    public void setId(int id) {
        this.id = id;
    }
    public void setVlasnik(String vlasnik) {
        this.vlasnik = vlasnik;
    }
    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }
    public void setMesto(String mesto) {
        this.mesto = mesto;
    }
    public void setOpis(String opis) {
        this.opis = opis;
    }
    public void setCenaLeto(Integer cena_leto) {
        this.cena_leto = cena_leto;
    }
    public void setCenaZima(Integer cena_zima) {
        this.cena_zima = cena_zima;
    }
    public void setX(Double x) {
        this.x = x;
    }
    public void setY(Double y) {
        this.y = y;
    }
    public void setSlike(String[] slike) {
        this.slike = slike; 
    }
    public void setTelefon(String telefon) {
        this.telefon = telefon;
    }

    @Override
    public String toString() {
        return "Vikendica{" +
                "id=" + id +
                ", vlasnik='" + vlasnik + '\'' +
                ", naziv='" + naziv + '\'' +
                ", mesto='" + mesto + '\'' +
                ", opis='" + opis + '\'' +
                ", telefon='" + telefon + '\'' +
                ", cena_leto=" + cena_leto +
                ", cena_zima=" + cena_zima +
                ", x=" + x +
                ", y=" + y +
                '}';
    }
}
