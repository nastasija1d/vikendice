import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KorisnikService } from '../../services/korisnik.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {
  servis = inject(KorisnikService)
  ruter = inject(Router);
  korisnik: any;
  izmenaKorisnik: any;
  izmena: boolean = false;
  greske: any = {};
  karticaIkonica: string | null = null;
  novaSlika: File | null = null;
  slikaIzabrana: boolean = false;

  ngOnInit() {
    const ulogovani = localStorage.getItem("ulogovaniKorisnik");
    if (ulogovani) {
      this.korisnik = JSON.parse(ulogovani);
    }
  }

  pokreniIzmenu() {
    this.izmenaKorisnik = { ...this.korisnik };
    this.izmena = true;
  }

  ponistiIzmene() {
    this.izmena = false;
    this.greske = {};
    this.karticaIkonica = null;
  }

  onSlikaChange(event: any) {
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      this.novaSlika = file;
      this.greske.slika = null;
      this.slikaIzabrana = true;
    } else {
      this.greske.slika = "Dozvoljeni su samo JPG i PNG formati.";
      this.novaSlika = null;
      this.slikaIzabrana = false;
    }
  }

  sacuvajIzmene() {
    this.greske = {};

    // Validacija
    if (!/^[A-Za-zŠĐČĆŽšđčćž\s]+$/.test(this.izmenaKorisnik.ime)) {
      this.greske.ime = "Ime mora sadržati samo slova.";
    }

    if (!/^[A-Za-zŠĐČĆŽšđčćž\s]+$/.test(this.izmenaKorisnik.prezime)) {
      this.greske.prezime = "Prezime mora sadržati samo slova.";
    }

    if (!/^\d+$/.test(this.izmenaKorisnik.telefon)) {
      this.greske.telefon = "Telefon mora sadržati samo cifre.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.izmenaKorisnik.email)) {
      this.greske.email = "Email nije ispravan.";
    }

    // Validacija broja kartice
    const broj = this.izmenaKorisnik.kartica;
    this.karticaIkonica = null;

    if (!broj) {
      this.greske.kartica = 'Broj kartice je obavezan.';
    } else if (/^3(00|01|02|03|6[0-9]|8[0-9])\d{12}$/.test(broj)) {
      this.karticaIkonica = 'dina.png';
    } else if (/^5[1-5]\d{14}$/.test(broj)) {
      this.karticaIkonica = 'master.png';
    } else if (/^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/.test(broj)) {
      this.karticaIkonica = 'visa.png';
    } else {
      this.greske.kartica = 'Unesite validan broj kartice (Visa, MasterCard, Diners).';
    }

    

    if (Object.keys(this.greske).length === 0) {
      console.log("Validacija prošla. Spremno za backend.");
      this.servis.izmeniKorisnika(this.izmenaKorisnik, this.novaSlika).subscribe(
        (data)=>{
          if (data ){
            alert("Podaci su uspešno izmenjeni.");
            this.korisnik = data;
            this.izmena = false;
            this.greske = {};
            this.novaSlika = null;
            localStorage.setItem("ulogovaniKorisnik", JSON.stringify(this.korisnik));
          }
          else{
            this.greske.email = "Korisnik sa tim emailom već postoji.";
          }
        }
      )
    }
  }

  logout(){
    localStorage.removeItem("ulogovaniKorisnik");
    this.ruter.navigate(['/login']);
  }


  }
