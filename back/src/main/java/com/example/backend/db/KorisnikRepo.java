package com.example.backend.db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.mindrot.jbcrypt.BCrypt;

import com.example.backend.models.Korisnik;

public class KorisnikRepo {

    public int registruj(Korisnik korisnik){
        String sql = "INSERT INTO Korisnik (username, lozinka, email, ime, prezime, pol, adresa, telefon, slika, kartica, tip, status) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DB.source().getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, korisnik.getUsername());
            String hesovanaLozinka = BCrypt.hashpw(korisnik.getLozinka(), BCrypt.gensalt());
            ps.setString(2, hesovanaLozinka);
            ps.setString(3, korisnik.getEmail());
            ps.setString(4, korisnik.getIme());
            ps.setString(5, korisnik.getPrezime());
            ps.setInt(6, korisnik.getPol());
            ps.setString(7, korisnik.getAdresa());
            ps.setString(8, korisnik.getTelefon());
            ps.setString(9, korisnik.getSlika()); 
            ps.setString(10, korisnik.getKartica());
            ps.setInt(11, korisnik.getTip());
            ps.setInt(12, 0); // status = 0

            int affected = ps.executeUpdate();
            return affected;

        } catch (SQLException e) {
            e.printStackTrace(); // ili loguj
            return 0;
        }
    }

    public Korisnik login(String username, String lozinka) {
    String sql = "SELECT * FROM Korisnik WHERE username = ?";
    try (Connection conn = DB.source().getConnection();
         PreparedStatement ps = conn.prepareStatement(sql)) {
        
        ps.setString(1, username);
        ResultSet rs = ps.executeQuery();
        if (rs.next()) {
            String hesiranaLozinka = rs.getString("lozinka");
            // Provera lozinke
            if (BCrypt.checkpw(lozinka, hesiranaLozinka)) {
                // Ako je lozinka tacna, kreiramo objekat Korisnik i vracamo
                Korisnik korisnik = new Korisnik();
                korisnik.setUsername(rs.getString("username"));
                korisnik.setEmail(rs.getString("email"));
                korisnik.setIme(rs.getString("ime"));
                korisnik.setPrezime(rs.getString("prezime"));
                korisnik.setPol(rs.getInt("pol"));
                korisnik.setAdresa(rs.getString("adresa"));
                korisnik.setTelefon(rs.getString("telefon"));
                korisnik.setSlika(rs.getString("slika"));
                korisnik.setKartica(rs.getString("kartica"));
                korisnik.setTip(rs.getInt("tip"));
                korisnik.setStatus(rs.getInt("status"));
                return korisnik;
            }
        }
        return null; // nije pronadjen korisnik ili je lozinka netacna
    } catch (SQLException e) {
        e.printStackTrace();
        return null;
    }
}

    public int promeniLozinku(String username, String staraLozinka, String novaLozinka) {
    try (Connection conn = DB.source().getConnection()) {
        PreparedStatement ps = conn.prepareStatement("SELECT lozinka FROM korisnik WHERE username = ?");
        ps.setString(1, username);
        ResultSet rs = ps.executeQuery();

        if (!rs.next()) return 0;
        String hesiranaStara = rs.getString("lozinka");
        if (!BCrypt.checkpw(staraLozinka, hesiranaStara)) {
            return 0; // Stara lozinka nije tačna
        }

        String novaHesirana = BCrypt.hashpw(novaLozinka, BCrypt.gensalt());
        PreparedStatement ps2 = conn.prepareStatement("UPDATE korisnik SET lozinka = ? WHERE username = ?");
        ps2.setString(1, novaHesirana);
        ps2.setString(2, username);
        return ps2.executeUpdate(); 

    } catch (Exception e) {
        e.printStackTrace();
        return 0;
    }
}


    
}
