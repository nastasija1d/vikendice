import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KorisnikService } from '../../services/korisnik.service';
import { CommonModule } from '@angular/common';
import { Korisnik } from '../../models/korisnik';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-registracija',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registracija.component.html',
  styleUrl: './registracija.component.css'
})
export class RegistracijaComponent {

  korisnik: Korisnik = new Korisnik();
  servis = inject(KorisnikService);

dodaj() {
  this.proveriIme();
  this.proveriPrezime();
  this.proveriEmail();
  this.proveriLozinku();
  this.proveriKarticu();
  this.proveriAdresu();
  this.proveriTelefon();
  this.proveriKorisnickoIme();

  const validnaForma =
    this.imeValidno &&
    this.prezimeValidno &&
    this.emailValidno &&
    this.lozinkaValidna &&
    this.karticaValidna &&
    this.adresaValidna &&
    this.telefonValidan &&
    this.korisnickoImeValidno;

  if (validnaForma) {
    console.log(this.korisnik);
    const formData = new FormData();
    formData.append('korisnik', new Blob([JSON.stringify(this.korisnik)], {type: 'application/json'}));
    if (this.slika) {
      formData.append('slika', this.slika);
    }
    this.servis.registrujKorisnika(formData).subscribe(
      (data)=>{
        if (data==1){
          alert('Korisnik uspešno registrovan!');
        }else{
          this.emailValidno = false;
          this.porukaEmail = 'Korisnik sa tim emailom već postoji.';
          this.korisnickoImeValidno = false;
          this.porukaKorisnickoIme = 'Korisničko ime je zauzeto.';
        }
      }
    )
  } else {
    console.warn('Forma nije validna.');
  }
}


  // validacioni flagovi i poruke
  imeValidno: boolean = true;
  porukaIme: string = '';

  prezimeValidno: boolean = true;
  porukaPrezime: string = '';

  emailValidno: boolean = true;
  porukaEmail: string = '';

  lozinkaValidna: boolean = true;
  porukaLozinka: string = '';

  karticaValidna: boolean = false;
  porukaKartica: string = '';
  tipKartice: string | null = null;

  adresaValidna: boolean = true;
  porukaAdresa: string = '';

  telefonValidan: boolean = true;
  porukaTelefon: string = '';

  korisnickoImeValidno: boolean = true;
  porukaKorisnickoIme: string = '';

  slika: File | null = null;
  slikaPoruka: string = '';
  slikaIzabrana: boolean = false;


  proveriIme() {
    if (!this.korisnik.ime.trim()) {
      this.imeValidno = false;
      this.porukaIme = 'Ime je obavezno.';
      return;
    }
    if (!/^[A-Za-zČĆŽŠĐčćžšđ\s'-]+$/.test(this.korisnik.ime)) {
      this.imeValidno = false;
      this.porukaIme = 'Ime može sadržati samo slova';
      return;
    }
    this.imeValidno = true;
    this.porukaIme = '';
  }

  proveriPrezime() {
    if (!this.korisnik.prezime.trim()) {
      this.prezimeValidno = false;
      this.porukaPrezime = 'Prezime je obavezno.';
      return;
    }
    if (!/^[A-Za-zČĆŽŠĐčćžšđ\s'-]+$/.test(this.korisnik.prezime)) {
      this.prezimeValidno = false;
      this.porukaPrezime = 'Prezime može sadržati samo slova';
      return;
    }
    this.prezimeValidno = true;
    this.porukaPrezime = '';
  }

  proveriEmail() {
    if (!this.korisnik.email.trim()) {
      this.emailValidno = false;
      this.porukaEmail = 'Email je obavezan.';
      return;
    }
    // jednostavan regex za email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(this.korisnik.email)) {
      this.emailValidno = false;
      this.porukaEmail = 'Email nije u validnom formatu.';
      return;
    }
    this.emailValidno = true;
    this.porukaEmail = '';
  }

  proveriLozinku() {
    const regex = /^(?=.*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]|;:'",.<>/?])[A-Za-z][A-Za-z\d!@#$%^&*()\-_=+{}[\]|;:'",.<>/?]{5,9}$/;
    if (!this.korisnik.lozinka) {
      this.lozinkaValidna = false;
      this.porukaLozinka = 'Lozinka je obavezna.';
      return;
    }
    if (!regex.test(this.korisnik.lozinka)) {
      this.lozinkaValidna = false;
      this.porukaLozinka = 'Lozinka mora imati 6-10 karaktera, početi slovom, imati 1 veliko slovo, 3 mala slova, 1 broj i 1 specijalni znak.';
      return;
    }
    this.lozinkaValidna = true;
    this.porukaLozinka = '';
  }

  proveriKarticu() {
    const broj = this.korisnik.kartica;
    this.tipKartice = null;
    this.karticaValidna = false;
    if (!broj) {
      this.porukaKartica = 'Broj kartice je obavezan.';
      return;
    }
    if (/^3(00|01|02|03|6[0-9]|8[0-9])\d{12}$/.test(broj)) {
      this.tipKartice = 'dina';
      this.karticaValidna = true;
    } else if (/^5[1-5]\d{14}$/.test(broj)) {
      this.tipKartice = 'master';
      this.karticaValidna = true;
    } else if (/^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/.test(broj)) {
      this.tipKartice = 'visa';
      this.karticaValidna = true;
    } else {
      this.porukaKartica = 'Unesite validan broj kartice (Visa, MasterCard, Diners).';
      this.karticaValidna = false;
      return;
    }
    this.porukaKartica = '';
  }

  proveriAdresu() {
  if (!this.korisnik.adresa || !this.korisnik.adresa.trim()) {
    this.adresaValidna = false;
    this.porukaAdresa = 'Adresa je obavezna.';
    return;
  }
  this.adresaValidna = true;
  this.porukaAdresa = '';
  }

  proveriTelefon() {
    if (!this.korisnik.telefon || !this.korisnik.telefon.trim()) {
      this.telefonValidan = false;
      this.porukaTelefon = 'Telefon je obavezan.';
      return;
    }
    if (!/^\d{6,15}$/.test(this.korisnik.telefon)) {
      this.telefonValidan = false;
      this.porukaTelefon = 'Telefon mora sadržati samo cifre (6–15 cifara).';
      return;
    }
    this.telefonValidan = true;
    this.porukaTelefon = '';
  }

  proveriKorisnickoIme() {
    if (!this.korisnik.username || !this.korisnik.username.trim()) {
      this.korisnickoImeValidno = false;
      this.porukaKorisnickoIme = 'Korisničko ime je obavezno.';
      return;
    }
    this.korisnickoImeValidno = true;
    this.porukaKorisnickoIme = '';
  }

  proveriSliku(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) {
    this.slika = null;
    this.slikaPoruka = '';
    return;
  }

  const fajl = input.files[0];
  this.slikaIzabrana = false;

  // Provera formata
  if (fajl.type !== 'image/jpeg' && fajl.type !== 'image/png') {
    this.slikaPoruka = 'Dozvoljeni formati su JPG i PNG.';
    this.slika = null;
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      if (img.width < 100 || img.height < 100 || img.width > 300 || img.height > 300) {
        this.slikaPoruka = 'Dimenzije slike moraju biti između 100x100 i 300x300 px.';
        this.slika = null;
      } else {
        this.slikaPoruka = '';
        this.slika = fajl;
        this.slikaIzabrana = true;
      }
    };
    img.onerror = () => {
      this.slikaPoruka = 'Neuspešno učitavanje slike.';
      this.slika = null;
    };
    img.src = e.target?.result as string;
  };
  reader.readAsDataURL(fajl);
}

}