package com.example.backend.db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;

import com.example.backend.models.Vikendica;

public class VikendicaRepo {

    public int dodajNovuVikendicu(Vikendica v) {
        String sql = "INSERT INTO Vikendica "
                   + "(vlasnik_username, naziv, mesto, opis, cena_leto, cena_zima, x, y, telefon) "
                   + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection c = DB.source().getConnection();
             PreparedStatement ps = c.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, v.getVlasnik());
            ps.setString(2, v.getNaziv());
            ps.setString(3, v.getMesto());
            ps.setString(4, v.getOpis());
            ps.setInt(5, v.getCenaLeto());
            ps.setInt(6, v.getCenaZima());
            ps.setBigDecimal(7, v.getX());
            ps.setBigDecimal(8, v.getY());
            ps.setString(9, v.getTelefon());

            ps.executeUpdate();
            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) return rs.getInt(1);
                else return 0;
            }
        }catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public int dodajJednuSlikuZaVikendicu(int idVik, String putanja) {
        try {
            Connection con = DB.source().getConnection();
            PreparedStatement ps = con.prepareStatement("insert into Vikendica_Slika (idVikendica, putanja) values(?, ?)");
            ps.setInt(1, idVik);
            ps.setString(2, putanja);
            return ps.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public Vikendica dohvatiVikendicu(int id) {
        try {
            Connection con = DB.source().getConnection();
            PreparedStatement ps = con.prepareStatement("select * from Vikendica where id = ?");
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                Vikendica v = new Vikendica();
                v.setId(rs.getInt("id"));
                v.setNaziv(rs.getString("naziv"));
                v.setMesto(rs.getString("mesto"));
                v.setTelefon(rs.getString("telefon"));
                v.setOpis(rs.getString("opis"));
                v.setCenaLeto(rs.getInt("cena_leto"));
                v.setCenaZima(rs.getInt("cena_zima"));
                v.setX(rs.getBigDecimal("x"));
                v.setY(rs.getBigDecimal("y"));
                v.setVlasnik(rs.getString("vlasnik_username"));
                v.setSlike(dohvatiSlikeZaVikendicu(id));
                return v;
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<String> dohvatiSlikeZaVikendicu(int id){
        try{
            Connection con = DB.source().getConnection();
            PreparedStatement ps = con.prepareStatement("select putanja from Vikendica_Slika where idVikendica = ?");
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            List<String> slike = new java.util.ArrayList<>();
            while(rs.next()){
                slike.add(rs.getString("putanja"));
            }
            return slike;
        }catch(Exception e){
            e.printStackTrace();
            return null;
        }
    }

    public int obrisiSliku(String imeFajla) {
        try {
            Connection con = DB.source().getConnection();
            PreparedStatement ps = con.prepareStatement("DELETE FROM Vikendica_Slika WHERE putanja = ?");
            ps.setString(1, imeFajla);
            System.out.println("Brisanje slike iz baze: " + imeFajla);
            return ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public int azurirajVikendicu(Vikendica vikendica) {
        try {
            Connection con = DB.source().getConnection();
            PreparedStatement ps = con.prepareStatement("Update vikendica set naziv = ?, mesto = ?, telefon = ?, opis = ?, cena_leto = ?, cena_zima = ?, x = ?, y = ? where id = ?");
            ps.setString(1, vikendica.getNaziv());
            ps.setString(2, vikendica.getMesto());
            ps.setString(3, vikendica.getTelefon());
            ps.setString(4, vikendica.getOpis());
            ps.setInt(5, vikendica.getCenaLeto());
            ps.setInt(6, vikendica.getCenaZima());
            ps.setBigDecimal(7, vikendica.getX());
            ps.setBigDecimal(8, vikendica.getY());
            ps.setInt(9, vikendica.getId());

            return ps.executeUpdate();
            
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }
    
}
