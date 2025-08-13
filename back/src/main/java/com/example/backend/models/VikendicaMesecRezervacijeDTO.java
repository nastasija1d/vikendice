package com.example.backend.models;

public class VikendicaMesecRezervacijeDTO {
    private int vikendicaId;
    private String naziv;
    private int[] meseci = new int[12]; // 0..11 → Jan..Dec

    public VikendicaMesecRezervacijeDTO(int vikendicaId, String naziv) {
        this.vikendicaId = vikendicaId;
        this.naziv = naziv;
    }

    public int getVikendicaId() { return vikendicaId; }
    public String getNaziv() { return naziv; }
    public int[] getMeseci() { return meseci; }
}
