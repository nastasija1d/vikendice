package com.example.backend.db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.example.backend.models.Ocena;
import com.example.backend.models.Vikendica;

public class VikendicaRepo {

    public int dodajNovuVikendicu(Vikendica v) {
        String sql = "INSERT INTO Vikendica "
                   + "(vlasnik_username, naziv, mesto, opis, cena_leto, cena_zima, x, y, telefon, pretraga) "
                   + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
            String pretraga = String.join(" ", v.getNaziv(), v.getMesto());
            ps.setString(10, pretraga.toLowerCase());

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
            PreparedStatement ps = con.prepareStatement("Update vikendica set naziv = ?, mesto = ?, telefon = ?, opis = ?, cena_leto = ?, cena_zima = ?, x = ?, y = ?, pretraga = ? where id = ?");
            ps.setString(1, vikendica.getNaziv());
            ps.setString(2, vikendica.getMesto());
            ps.setString(3, vikendica.getTelefon());
            ps.setString(4, vikendica.getOpis());
            ps.setInt(5, vikendica.getCenaLeto());
            ps.setInt(6, vikendica.getCenaZima());
            ps.setBigDecimal(7, vikendica.getX());
            ps.setBigDecimal(8, vikendica.getY());
            ps.setInt(10, vikendica.getId());
            String pretraga = String.join(" ", vikendica.getNaziv(), vikendica.getMesto());
            ps.setString(9, pretraga.toLowerCase());

            return ps.executeUpdate();
            
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public List<Vikendica> dohvatiSveVikendiceVlasnika(String id) {
        try {
            Connection con = DB.source().getConnection();
            PreparedStatement ps = con.prepareStatement("Select * from vikendica where vlasnik_username = ?");
            ps.setString(1, id);
            ResultSet rs = ps.executeQuery();
            List<Vikendica> vikendice = new java.util.ArrayList<>();
            while (rs.next()) {
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
                v.setSlike(dohvatiSlikeZaVikendicu(rs.getInt("id")));
                vikendice.add(v);
            }
            return vikendice;
            
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    //ova metoda vraca sve vikendice, dodatno filtrira po nazivu
    public List<Vikendica> dohvatiSveVikendice(String search) {
        try {
            Connection con = DB.source().getConnection();

            StringBuilder query = new StringBuilder("SELECT * FROM vikendica");
            List<String> searchWords = new ArrayList<>();
            List<String> conditions = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                query.append(" WHERE ");
                // Podeli na reci
                for (String word : search.trim().split("\s+")) {
                    conditions.add("LOWER(pretraga) LIKE ?");
                    searchWords.add("%" + word.toLowerCase() + "%");
                }
                query.append(String.join(" AND ", conditions));
            }

            PreparedStatement ps = con.prepareStatement(query.toString());

            // Postavi parametre u PreparedStatement
            for (int i = 0; i < searchWords.size(); i++) {
                ps.setString(i + 1, searchWords.get(i));
            }

            ResultSet rs = ps.executeQuery();
            List<Vikendica> vikendice = new ArrayList<>();

            while (rs.next()) {
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
                v.setSlike(dohvatiSlikeZaVikendicu(rs.getInt("id")));
                v.setOcena(dohvatiProsecnuOcenuZaVikendicu(rs.getInt("id")));
                v.setBlokirana(rs.getInt("blokirana"));
                vikendice.add(v);
            }

            return vikendice;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Vikendica> dohvatiSveVikendiceZaAdmina() {
        try {
            Connection con = DB.source().getConnection();
            PreparedStatement ps = con.prepareStatement("SELECT * FROM vikendica");

            ResultSet rs = ps.executeQuery();
            List<Vikendica> vikendice = new ArrayList<>();

            while (rs.next()) {
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
                v.setBlokirana(rs.getInt("blokirana"));
                //v.setSlike(dohvatiSlikeZaVikendicu(rs.getInt("id")));
                v.setOcena(dohvatiPoslednje3OceneZaVikendicu(rs.getInt("id")));
                vikendice.add(v);
            }

            return vikendice;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Ocena> dohvatiOceneZaVikendicu(int id) {
        try {
            Connection con = DB.source().getConnection();
            PreparedStatement ps = con.prepareStatement("select r.ocena, r.ocenatekst, r.idturista, k.ime, k.prezime\n" + //
                                "from rezervacija r inner join korisnik k\n" + //
                                "on k.username = r.idturista\n" + //
                                "where r.idvikendica=? and r.ocena is not null");
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            List<Ocena> lista = new ArrayList<>();
            while (rs.next()){
                Ocena o = new Ocena();
                o.setBroj(rs.getInt(1));
                o.setTekst(rs.getString(2));
                o.setUsername(rs.getString(3));
                o.setIme(rs.getString(4)+ " " + rs.getString(5));
                lista.add(o);
            }
            return lista;
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private double dohvatiProsecnuOcenuZaVikendicu(int id){
        try {
            Connection con = DB.source().getConnection();
            PreparedStatement ps = con.prepareStatement("select avg(ocena) from\n" + //
                                "rezervacija where idvikendica=?");
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if(rs.next()){
                return rs.getDouble(1);
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    private double dohvatiPoslednje3OceneZaVikendicu(int id){
        try {
            Connection con = DB.source().getConnection();
            PreparedStatement ps = con.prepareStatement("SELECT AVG(ocena) AS prosek_poslednje_3\n" + //
                                "FROM (\n" + //
                                "    SELECT ocena\n" + //
                                "    FROM rezervacija\n" + //
                                "    WHERE idvikendica = ?\n" + //
                                "      AND ocena IS NOT NULL\n" + //
                                "    ORDER BY datumod DESC\n" + //
                                "    LIMIT 3\n" + //
                                ") AS poslednje_tri;\n");
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if(rs.next()){
                return rs.getDouble(1);
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    public int blokirajVikendicu(int id) {
        try {
            Connection con = DB.source().getConnection();
            PreparedStatement ps = con.prepareStatement("Update vikendica set blokirana=1 where id=?");
            ps.setInt(1, id);
            return ps.executeUpdate();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    
}
