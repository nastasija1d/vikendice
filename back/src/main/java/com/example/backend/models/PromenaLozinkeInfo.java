package com.example.backend.models;

public class PromenaLozinkeInfo {
    public String username;
    public String staraLozinka;
    public String novaLozinka;

    public PromenaLozinkeInfo() {
    }
    public PromenaLozinkeInfo(String username, String staraLozinka, String novaLozinka) {
        this.username = username;
        this.staraLozinka = staraLozinka;
        this.novaLozinka = novaLozinka;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getStaraLozinka() {
        return staraLozinka;
    }
    public void setStaraLozinka(String staraLozinka) {
        this.staraLozinka = staraLozinka;
    }
    public String getNovaLozinka() {
        return novaLozinka;
    }
    public void setNovaLozinka(String novaLozinka) {
        this.novaLozinka = novaLozinka;
    }
}


