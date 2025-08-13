package com.example.backend.db;

import java.io.File;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.web.multipart.MultipartFile;

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
    String sql = "SELECT * FROM Korisnik WHERE username = ? and tip>0";
        try (Connection conn = DB.source().getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, username);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                String hesiranaLozinka = rs.getString("lozinka");
                // Provera lozinke
                if (BCrypt.checkpw(lozinka, hesiranaLozinka)) {
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
            return null;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    public Korisnik loginAdmin(String username, String lozinka) {
        String sql = "SELECT * FROM Korisnik WHERE username = ? and tip=0";
        try (Connection conn = DB.source().getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, username);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                String hesiranaLozinka = rs.getString("lozinka");
                // Provera lozinke
                if (BCrypt.checkpw(lozinka, hesiranaLozinka)) {
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
            return null;
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

    public Korisnik izmeniPodatke(String username, String ime, String prezime, String adresa, String telefon,
                         String email, String kartica, MultipartFile slika) {
        try (Connection conn = DB.source().getConnection()) {
            // Provera da li postoji drugi korisnik sa tim emailom
            PreparedStatement provera = conn.prepareStatement(
                "SELECT * FROM korisnik WHERE email = ? AND username <> ?"
            );
            provera.setString(1, email);
            provera.setString(2, username);
            ResultSet rs = provera.executeQuery();
            if (rs.next()) {
                System.out.println("EMAIL ZAJEBAVAAA!!!!");
                return null; 
            }

            PreparedStatement update = conn.prepareStatement(
                "UPDATE korisnik SET ime = ?, prezime = ?," + 
                "adresa = ?, telefon = ?, email = ?, kartica = ? WHERE username = ?"
            );
            update.setString(1, ime);
            update.setString(2, prezime);
            update.setString(3, adresa);
            update.setString(4, telefon);
            update.setString(5, email);
            update.setString(6, kartica);
            update.setString(7, username);
            update.executeUpdate();

            // Ako je slika prosleđena, sačuvaj je i ažuriraj samo to polje
            if (slika != null && !slika.isEmpty()) {
                System.out.println("SLIKA POSTOJIII!");
                String rootPath = System.getProperty("user.dir");  
                String uploadDir = rootPath + File.separator + "back" + File.separator + "slike" + File.separator + "korisnici" + File.separator;

                File folder = new File(uploadDir);
                if (!folder.exists()) folder.mkdirs();
                String originalIme = slika.getOriginalFilename();
                String ekstenzija = "";
                if (originalIme != null && originalIme.contains(".")) {
                    ekstenzija = originalIme.substring(originalIme.lastIndexOf("."));
                }

                String imeFajla = username + "_" + System.currentTimeMillis() + ekstenzija;
                File destinacija = new File(uploadDir + imeFajla);
                slika.transferTo(destinacija);

                PreparedStatement updateSlike = conn.prepareStatement(
                    "UPDATE korisnik SET slika = ? WHERE username = ?"
                );
                String putanjaDoSlike = "slike/korisnici/" + imeFajla;
                updateSlike.setString(1, putanjaDoSlike);
                updateSlike.setString(2, username);
                updateSlike.executeUpdate();
                System.out.println("SLIKA SACUVANA:" + putanjaDoSlike);
            }
            
            //Na kraju – vrati ažuriranog korisnika
            PreparedStatement fetch = conn.prepareStatement("SELECT * FROM korisnik WHERE username = ?");
            fetch.setString(1, username);
            ResultSet r = fetch.executeQuery();
            if (r.next()) {
                Korisnik k = new Korisnik();
                k.setUsername(r.getString("username"));
                k.setIme(r.getString("ime"));
                k.setPrezime(r.getString("prezime"));
                k.setAdresa(r.getString("adresa"));
                k.setTelefon(r.getString("telefon"));
                k.setEmail(r.getString("email"));
                k.setKartica(r.getString("kartica"));
                k.setSlika(r.getString("slika"));
                k.setPol(r.getInt("pol"));
                k.setTip(r.getInt("tip"));
                k.setStatus(r.getInt("status"));
                return k;
            } return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
      
    public List<Korisnik> dohvaiSveZahteve(){
        String sql = "SELECT * FROM Korisnik WHERE status = 0";
        try (Connection conn = DB.source().getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)) {
            ResultSet rs = ps.executeQuery();
            List<Korisnik> lista = new ArrayList<>();
            while (rs.next()) {
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
                lista.add(korisnik); 
            }
            return lista;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    public int potvrdiZahtev(String username) {
        String sql = "update Korisnik set status=1 WHERE username = ?";
        try (Connection conn = DB.source().getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, username);
            return ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            return 0;
        }

    }

    public int odbiZahtev(String username) {
        String sql = "update Korisnik set status=2 WHERE username = ?";
        try (Connection conn = DB.source().getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, username);
            return ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            return 0;
        }
    }

    public int blokirajKorisnika(String username) {
        String sql = "update Korisnik set status=3 WHERE username = ?";
        try (Connection conn = DB.source().getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, username);
            return ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            return 0;
        }
    }

    public List<Korisnik> dohvatiSveKorisnike() {
        String sql = "SELECT * FROM Korisnik WHERE tip > 0 and (status = 1 or status = 3 ) order by status";
        try (Connection conn = DB.source().getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)) {
            ResultSet rs = ps.executeQuery();
            List<Korisnik> lista = new ArrayList<>();
            while (rs.next()) {
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
                lista.add(korisnik); 
            }
            return lista;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }

    }

    public Korisnik dohvatiKorisnika(String id) {
        String sql = "SELECT * FROM Korisnik WHERE username = ?";
        try (Connection conn = DB.source().getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, id);
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
