package com.example.backend.models;

public class ZauzetostDTO {
    private int vikendicaId;
    private String naziv;
    private int radniDani;
    private int vikendi;

    // konstruktori, getteri, setteri
    public ZauzetostDTO(int vikendicaId, String naziv, int radniDani, int vikendi) {
        this.vikendicaId = vikendicaId;
        this.naziv = naziv;
        this.radniDani = radniDani;
        this.vikendi = vikendi;
    }

    public int getVikendicaId() {
        return vikendicaId;
    }

    public void setVikendicaId(int vikendicaId) {
        this.vikendicaId = vikendicaId;
    }

    public String getNaziv() {
        return naziv;
    }

    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }

    public int getRadniDani() {
        return radniDani;
    }

    public void setRadniDani(int radniDani) {
        this.radniDani = radniDani;
    }

    public int getVikendi() {
        return vikendi;
    }

    public void setVikendi(int vikendi) {
        this.vikendi = vikendi;
    }

    
}

