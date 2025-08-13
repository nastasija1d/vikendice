package com.example.backend.models;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

public class Vikendica {
    private int id;
    private String vlasnik;
    private String naziv;
    private String mesto;
    private String opis;
    private String telefon;
    private Integer cena_leto;
    private Integer cena_zima;
    private BigDecimal x;
    private BigDecimal y;
    private List<String> slike; 
    private double ocena;  
    private Date vremeBlokiranja; 
    private int blokirana;


    public Vikendica(int id, String vlasnik, String naziv, String mesto, 
    String opis,String telefon, Integer cena_leto, Integer cena_zima, BigDecimal x, BigDecimal y, List<String> slike) {
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
        this.x = BigDecimal.ZERO;
        this.y = BigDecimal.ZERO;
        this.slike = new ArrayList<>();
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
    public BigDecimal getX() {
        return x;
    }
    public BigDecimal getY() {
        return y;
    }
    public List<String> getSlike() {
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
    public void setX(BigDecimal x) {
        this.x = x;
    }
    public void setY(BigDecimal y) {
        this.y = y;
    }
    public void setSlike(List<String> slike) {
        this.slike = slike; 
    }
    public void setTelefon(String telefon) {
        this.telefon = telefon;
    }

    public double getOcena() {
        return ocena;
    }

    public void setOcena(double ocena) {
        this.ocena = ocena;
    }

    public Date getVremeBlokiranja() {
        return vremeBlokiranja;
    }

    public void setVremeBlokiranja(Date vremeBlokiranja) {
        this.vremeBlokiranja = vremeBlokiranja;
    }

    public int getBlokirana() {
        return blokirana;
    }

    public void setBlokirana(int blokirana) {
        this.blokirana = blokirana;
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
