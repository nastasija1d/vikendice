import { Component, inject, OnInit } from '@angular/core';
import { Korisnik } from '../../models/korisnik';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { KorisnikService } from '../../services/korisnik.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-azuriraj-korisnika',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './azuriraj-korisnika.component.html',
  styleUrl: './azuriraj-korisnika.component.css'
})
export class AzurirajKorisnikaComponent implements OnInit {

  korisnik: Korisnik
  username: string
  ruta = inject(ActivatedRoute)
  ruter = inject(Router)
  servis = inject(KorisnikService)

  ngOnInit(): void {
    this.username = this.ruta.snapshot.paramMap.get('username')!;
    this.servis.dohvatiKorisnika(this.username).subscribe((data)=>{this.korisnik=data})
  }

  greske: any = {};
  karticaIkonica: string | null = null;
  novaSlika: File | null = null;
  slikaIzabrana: boolean = false;

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
    if (!/^[A-Za-zŠĐČĆŽšđčćž\s]+$/.test(this.korisnik.ime)) {
      this.greske.ime = "Ime mora sadržati samo slova.";
    }

    if (!/^[A-Za-zŠĐČĆŽšđčćž\s]+$/.test(this.korisnik.prezime)) {
      this.greske.prezime = "Prezime mora sadržati samo slova.";
    }

    if (!/^\d+$/.test(this.korisnik.telefon)) {
      this.greske.telefon = "Telefon mora sadržati samo cifre.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.korisnik.email)) {
      this.greske.email = "Email nije ispravan.";
    }

    // Validacija broja kartice
    const broj = this.korisnik.kartica;
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
      this.servis.izmeniKorisnika(this.korisnik, this.novaSlika).subscribe(
        (data)=>{
          if (data ){
            this.korisnik = data;
            alert("Podaci su uspešno izmenjeni.");
            this.ruter.navigate(['admin/svikorisnici'])
          }
          else{
            this.greske.email = "Korisnik sa tim emailom već postoji.";
          }
        }
      )
    }
  }

  ponisti(){
    this.ruter.navigate(['admin/svikorisnici'])
  }


}
