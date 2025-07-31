package com.example.backend.db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

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
            ps.setDouble(7, v.getX());
            ps.setDouble(8, v.getY());
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
    
}
