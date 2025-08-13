package com.example.backend.db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.example.backend.models.Korisnik;
import com.example.backend.models.Rezervacija;
import com.example.backend.models.Vikendica;

public class RezervacijaRepo {

    public int napraviRezervaciju(Rezervacija r) {
        try {
            Connection conn = DB.source().getConnection();
            String proveraSql = "SELECT COUNT(*) FROM Rezervacija WHERE idVikendica = ? AND NOT (datumDO <= ? OR datumOD >= ?) AND status>2";
            try (PreparedStatement stmt = conn.prepareStatement(proveraSql)) {
                stmt.setInt(1, r.getVikendica().getId());
                stmt.setDate(2, r.getDatumOD());
                stmt.setDate(3, r.getDatumDO());

                ResultSet rs = stmt.executeQuery();
                if (rs.next() && rs.getInt(1) > 0) {
                    return 0; 
                }
            }

            java.sql.Date datumKreiranja = new java.sql.Date(new java.util.Date().getTime());

            String insertSql = "INSERT INTO Rezervacija (idTurista, idVikendica, datumOD, datumDO, odrasli, deca, cena, kartica, status, komentarT, komentarV, datumKreiranja) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            try (PreparedStatement stmt = conn.prepareStatement(insertSql)) {
                stmt.setString(1, r.getTurista());
                stmt.setInt(2, r.getVikendica().getId());
                stmt.setDate(3, r.getDatumOD());
                stmt.setDate(4, r.getDatumDO());
                stmt.setInt(5, r.getOdrasli());
                stmt.setInt(6, r.getDeca());
                stmt.setInt(7, r.getCena());
                stmt.setString(8, r.getKartica());
                stmt.setInt(9, r.getStatus());
                stmt.setString(10, r.getKomentarTurista());
                stmt.setString(11, r.getKomentarVlasnik());
                stmt.setDate(12, datumKreiranja);

                return stmt.executeUpdate(); 
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    public List<Rezervacija> dohvatiAktivneZaTuristu(String id) {
        azurirajStatuseRezervacija();
        try {
            Connection con = DB.source().getConnection();
            PreparedStatement ps = con.prepareStatement("select id, idturista, idvikendica, datumod, datumdo,\n" + //
                                "odrasli, deca, cena, kartica, status, \n" + //
                                "komentarT, komentarv, datumkreiranja, ocena, ocenatekst\n" + //
                                "from rezervacija where idturista=? order by datumOD desc");
            ps.setString(1, id);
            ResultSet rs = ps.executeQuery();
            List<Rezervacija> lista = new ArrayList<>();
            while(rs.next()){
                Rezervacija rez = new Rezervacija();
                rez.setId(rs.getInt("id"));
                rez.setTurista(rs.getString("idturista"));
                rez.setDatumOD(rs.getDate("datumod"));
                rez.setDatumDO(rs.getDate("datumdo"));
                rez.setOdrasli(rs.getInt("odrasli"));
                rez.setDeca(rs.getInt("deca"));
                rez.setCena(rs.getInt("cena"));
                rez.setKartica(rs.getString("kartica"));
                rez.setStatus(rs.getInt("status"));
                rez.setKomentarTurista(rs.getString("komentarT"));
                rez.setKomentarVlasnik(rs.getString("komentarV"));
                rez.setDatumKreiranja(rs.getDate("datumkreiranja"));
                rez.setOcena(rs.getInt("ocena"));
                rez.setOcenaText(rs.getString("ocenatekst"));
                Vikendica vik = new VikendicaRepo().dohvatiVikendicu(rs.getInt("idvikendica"));
                rez.setVikendica(vik);
                lista.add(rez);
            }
            return lista;
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<Rezervacija> dohvatiAktivneZaVlasnika(String id) {
        azurirajStatuseRezervacija();
        try {
            Connection con = DB.source().getConnection();
            PreparedStatement ps = con.prepareStatement("select r.id, r.idturista, r.idvikendica, r.datumod, r.datumdo,\n" + //
                                "odrasli, deca, cena, kartica, status, \n" + //
                                "r.komentarT, r.komentarv, r.datumkreiranja, r.ocena, r.ocenatekst\n" + //
                                "FROM Rezervacija r inner join vikendica v\n" + //
                                "on v.id = r.idvikendica \n" + //
                                "where v.vlasnik_username=?\n" + //
                                "order by r.datumOD desc");
            ps.setString(1, id);
            ResultSet rs = ps.executeQuery();
            List<Rezervacija> lista = new ArrayList<>();
            while(rs.next()){
                Rezervacija rez = new Rezervacija();
                rez.setId(rs.getInt("r.id"));
                rez.setTurista(rs.getString("r.idturista"));
                rez.setDatumOD(rs.getDate("r.datumod"));
                rez.setDatumDO(rs.getDate("r.datumdo"));
                rez.setOdrasli(rs.getInt("r.odrasli"));
                rez.setDeca(rs.getInt("r.deca"));
                rez.setCena(rs.getInt("r.cena"));
                rez.setKartica(rs.getString("r.kartica"));
                rez.setStatus(rs.getInt("r.status"));
                rez.setKomentarTurista(rs.getString("r.komentarT"));
                rez.setKomentarVlasnik(rs.getString("r.komentarV"));
                rez.setDatumKreiranja(rs.getDate("r.datumkreiranja"));
                rez.setOcena(rs.getInt("r.ocena"));
                rez.setOcenaText(rs.getString("r.ocenatekst"));
                Vikendica vik = new VikendicaRepo().dohvatiVikendicu(rs.getInt("r.idvikendica"));
                rez.setVikendica(vik);
                Korisnik kor = dohvatiKorisnika(rs.getString("r.idturista"));
                rez.setTuristaKlasa(kor);
                lista.add(rez);
            }
            return lista;
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<Rezervacija> dohvatiSveZaVikendicu(int id) {
     azurirajStatuseRezervacija();
        try {
            Connection con = DB.source().getConnection();
            PreparedStatement ps = con.prepareStatement("select id, idturista, idvikendica, datumod, datumdo,\n" + //
                                "odrasli, deca, cena, kartica, status, \n" + //
                                "komentarT, komentarv, datumkreiranja, ocena, ocenatekst\n" + //
                                "from rezervacija where idvikendica=? order by datumOD desc");
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            List<Rezervacija> lista = new ArrayList<>();
            while(rs.next()){
                Rezervacija rez = new Rezervacija();
                rez.setId(rs.getInt("id"));
                rez.setTurista(rs.getString("idturista"));
                rez.setDatumOD(rs.getDate("datumod"));
                rez.setDatumDO(rs.getDate("datumdo"));
                rez.setOdrasli(rs.getInt("odrasli"));
                rez.setDeca(rs.getInt("deca"));
                rez.setCena(rs.getInt("cena"));
                rez.setKartica(rs.getString("kartica"));
                rez.setStatus(rs.getInt("status"));
                rez.setKomentarTurista(rs.getString("komentarT"));
                rez.setKomentarVlasnik(rs.getString("komentarV"));
                rez.setDatumKreiranja(rs.getDate("datumkreiranja"));
                rez.setOcena(rs.getInt("ocena"));
                rez.setOcenaText(rs.getString("ocenatekst"));
                lista.add(rez);
            }
            return lista;
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
  
    public int otkaziRezervaciju(int id){
        try {
            Connection con = DB.source().getConnection();
            PreparedStatement ps = con.prepareStatement("update rezervacija set status = 1 where id=?");
            ps.setInt(1, id);
            return ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    public int potvrdiRezervaciju(Rezervacija r){
        try {
            Connection conn = DB.source().getConnection();
            String proveraSql = "SELECT COUNT(*) FROM Rezervacija WHERE idVikendica = ? AND NOT (datumDO <= ? OR datumOD >= ?) AND status>2";
            try (PreparedStatement stmt = conn.prepareStatement(proveraSql)) {
                stmt.setInt(1, r.getVikendica().getId());
                stmt.setDate(2, r.getDatumOD());
                stmt.setDate(3, r.getDatumDO());

                ResultSet rs = stmt.executeQuery();
                if (rs.next() && rs.getInt(1) > 0) {
                    return 0; 
                }
            }
            PreparedStatement ps = conn.prepareStatement("update rezervacija set status = 3 where id=?");
            ps.setInt(1, r.getId());
            return ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    public int odbiRezervaciju(int id, String komentar) {
        try {
            Connection con = DB.source().getConnection();
            PreparedStatement ps = con.prepareStatement("update rezervacija set status = 2, komentarV=? where id=?");
            ps.setInt(2, id);
            ps.setString(1, komentar);
            return ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    public int oceniRezervaciju(Rezervacija r) {
        try {
            Connection con = DB.source().getConnection();
            PreparedStatement ps = con.prepareStatement("update rezervacija set ocena = ?, ocenatekst = ? where id=?");
            ps.setInt(1, r.getOcena());
            ps.setString(2,r.getOcenaText());
            ps.setInt(3, r.getId());
            return ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }
    
    private void azurirajStatuseRezervacija() {
        try (Connection con = DB.source().getConnection()) {
            PreparedStatement ps = con.prepareStatement("SELECT id, datumod, datumdo, status FROM rezervacija");
            ResultSet rs = ps.executeQuery();

            LocalDate danas = LocalDate.now();

            while (rs.next()) {
                int id = rs.getInt("id");
                LocalDate datumOD = rs.getDate("datumod").toLocalDate();
                LocalDate datumDO = rs.getDate("datumdo").toLocalDate();
                int status = rs.getInt("status");

                Integer noviStatus = null;

                if (status == 0 && danas.isAfter(datumOD.minusDays(1))) {
                    noviStatus = 2; // odbijena od vlasnika
                } else if (status == 3 && danas.isAfter(datumOD)) {
                    noviStatus = 4; // u toku
                } else if ((status == 3 || status == 4) && danas.isAfter(datumDO)) {
                    noviStatus = 5; // zavrsena
                }

                if (noviStatus != null) {
                    PreparedStatement update = con.prepareStatement("UPDATE rezervacija SET status = ? WHERE id = ?");
                    update.setInt(1, noviStatus);
                    update.setInt(2, id);
                    update.executeUpdate();
                    update.close();
                }
            }

            rs.close();
            ps.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private Korisnik dohvatiKorisnika(String username){
        String sql = "SELECT * FROM Korisnik WHERE username = ?";
        try {
            Connection conn = DB.source().getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);         
            ps.setString(1, username);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
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
            return null;     
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }


}
