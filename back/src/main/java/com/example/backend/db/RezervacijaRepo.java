package com.example.backend.db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.example.backend.models.Korisnik;
import com.example.backend.models.Rezervacija;
import com.example.backend.models.Vikendica;
import com.example.backend.models.VikendicaMesecRezervacijeDTO;
import com.example.backend.models.ZauzetostDTO;

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
    
    public List<VikendicaMesecRezervacijeDTO> dohvatiBrojRezervacijaPoMesecima(String vlasnikUsername) {
        List<VikendicaMesecRezervacijeDTO> rezultat = new ArrayList<>();

        // Generišemo sve mesece 1..12, pa CROSS JOIN sa vikendicama vlasnika,
        // pa LEFT JOIN sa agregiranim rezervacijama — COALESCE na 0.
        String sql =
            "SELECT v.id AS vikendica_id, v.naziv, m.mesec AS mesec, COALESCE(cnt.broj, 0) AS broj " +
            "FROM ( " +
            "   SELECT 1 AS mesec UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL " +
            "   SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL " +
            "   SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 " +
            ") m " +
            "CROSS JOIN ( " +
            "   SELECT id, naziv FROM Vikendica WHERE vlasnik_username = ? " +
            ") v " +
            "LEFT JOIN ( " +
            "   SELECT r.idVikendica, MONTH(r.datumOD) AS mesec, COUNT(*) AS broj " +
            "   FROM Rezervacija r " +
            "   JOIN Vikendica vv ON vv.id = r.idVikendica " +
            "   WHERE vv.vlasnik_username = ? AND r.status > 2 " +
            "   GROUP BY r.idVikendica, MONTH(r.datumOD) " +
            ") cnt ON cnt.idVikendica = v.id AND cnt.mesec = m.mesec " +
            "ORDER BY v.naziv, m.mesec";

        try (Connection conn = DB.source().getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)) {

            // isti parametar ide na oba mesta (u podupitima)
            ps.setString(1, vlasnikUsername);
            ps.setString(2, vlasnikUsername);

            try (ResultSet rs = ps.executeQuery()) {
                // Mapiranje: jedan DTO po vikendici, punimo niz[12]
                Map<Integer, VikendicaMesecRezervacijeDTO> mapa = new LinkedHashMap<>();

                while (rs.next()) {
                    int vikendicaId = rs.getInt("vikendica_id");
                    String naziv = rs.getString("naziv");
                    int mesec = rs.getInt("mesec"); // 1..12
                    int broj = rs.getInt("broj");

                    VikendicaMesecRezervacijeDTO dto = mapa.get(vikendicaId);
                    if (dto == null) {
                        dto = new VikendicaMesecRezervacijeDTO(vikendicaId, naziv);
                        mapa.put(vikendicaId, dto);
                    }
                    dto.getMeseci()[mesec - 1] = broj; // u niz na poziciju 0..11
                }

                rezultat.addAll(mapa.values());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return rezultat;
    }

    public List<ZauzetostDTO> getZauzetostPoVikendicama(String username) {
        List<ZauzetostDTO> rezultat = new ArrayList<>();

        String sql = "SELECT v.id, v.naziv, r.datumOd, r.datumDo " +
                    "FROM vikendica v " +
                    "JOIN rezervacija r ON v.id = r.idvikendica " +
                    "WHERE v.vlasnik_Username = ? and r.status>2";

        try (Connection conn = DB.source().getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, username);

            try (ResultSet rs = ps.executeQuery()) {
                Map<Integer, ZauzetostDTO> mapa = new HashMap<>();

                while (rs.next()) {
                    int vikendicaId = rs.getInt("id");
                    String naziv = rs.getString("naziv");
                    LocalDate datumOd = rs.getDate("datumOd").toLocalDate();
                    LocalDate datumDo = rs.getDate("datumDo").toLocalDate();

                    ZauzetostDTO dto = mapa.getOrDefault(
                        vikendicaId, new ZauzetostDTO(vikendicaId, naziv, 0, 0)
                    );

                    // prolazak kroz sve dane u rezervaciji
                    LocalDate d = datumOd;
                    while (!d.isAfter(datumDo)) {
                        DayOfWeek dan = d.getDayOfWeek();
                        if (dan == DayOfWeek.SATURDAY || dan == DayOfWeek.SUNDAY) {
                            dto.setVikendi(dto.getVikendi() + 1);
                        } else {
                            dto.setRadniDani(dto.getRadniDani() + 1);
                        }
                        d = d.plusDays(1);
                    }

                    mapa.put(vikendicaId, dto);
                }

                rezultat.addAll(mapa.values());
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return rezultat;
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
