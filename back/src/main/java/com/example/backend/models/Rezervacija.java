package com.example.backend.models;

import java.sql.Date;

public class Rezervacija {
    private int id;
    private String turista; 
    private Korisnik turistaKlasa;
    private Vikendica vikendica;
    private Date datumOD;
    private Date datumDO;
    private int odrasli;
    private int deca;
    private int cena;
    private String kartica;
    private int status;
    private String komentarTurista;
    private String komentarVlasnik;
    private Date datumKreiranja;
    private int ocena;
    private String ocenaText;

    // Getteri i setteri
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTurista() { return turista; }
    public void setTurista(String turista) { this.turista = turista; }

    public Vikendica getVikendica() { return vikendica; }
    public void setVikendica(Vikendica vikendica) { this.vikendica = vikendica; }

    public Date getDatumOD() { return datumOD; }
    public void setDatumOD(Date datumOD) { this.datumOD = datumOD; }

    public Date getDatumDO() { return datumDO; }
    public void setDatumDO(Date datumDO) { this.datumDO = datumDO; }

    public int getOdrasli() { return odrasli; }
    public void setOdrasli(int odrasli) { this.odrasli = odrasli; }

    public int getDeca() { return deca; }
    public void setDeca(int deca) { this.deca = deca; }

    public int getCena() { return cena; }
    public void setCena(int cena) { this.cena = cena; }

    public String getKartica() { return kartica; }
    public void setKartica(String kartica) { this.kartica = kartica; }

    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }

    public String getKomentarTurista() { return komentarTurista; }
    public void setKomentarTurista(String komentarTurista) { this.komentarTurista = komentarTurista; }

    public String getKomentarVlasnik() { return komentarVlasnik; }
    public void setKomentarVlasnik(String komentarVlasnik) { this.komentarVlasnik = komentarVlasnik; }

    public Date getDatumKreiranja() { return datumKreiranja; }
    public void setDatumKreiranja(Date datumKreiranja) { this.datumKreiranja = datumKreiranja; }

    public int getOcena() {return ocena;}
    public void setOcena(int ocena) {this.ocena = ocena;}
    
    public String getOcenaText() {return ocenaText;}
    public void setOcenaText(String ocenaText) {this.ocenaText = ocenaText;}
        
    public Korisnik getTuristaKlasa() {return turistaKlasa;}
    public void setTuristaKlasa(Korisnik turistaKlasa) { this.turistaKlasa = turistaKlasa;}


    @Override
    public String toString() {
        return "Rezervacija [id=" + id + ", turista=" + turista + ", vikendica=" + vikendica + ", datumOD=" + datumOD
                + ", datumDO=" + datumDO + ", odrasli=" + odrasli + ", deca=" + deca + ", cena=" + cena + ", kartica="
                + kartica + ", status=" + status + ", komentarTurista=" + komentarTurista + ", komentarVlasnik="
                + komentarVlasnik + ", datumKreiranja=" + datumKreiranja + "]";
    }


    
}
