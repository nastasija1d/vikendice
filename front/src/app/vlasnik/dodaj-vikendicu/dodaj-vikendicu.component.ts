import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MapaComponent } from '../mapa/mapa.component';
import { Vikendica } from '../../models/vikendica';
import { VikendicaService } from '../../services/vikendica.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dodaj-vikendicu',
  standalone: true,
  imports: [CommonModule, FormsModule, MapaComponent],
  templateUrl: './dodaj-vikendicu.component.html',
  styleUrl: './dodaj-vikendicu.component.css'
})
export class DodajVikendicuComponent implements OnInit{
  vikendica = new Vikendica();
  slikeFajlovi: File[] = [];
  slikaIzabrana = false;
  servis = inject(VikendicaService)
  ruter = inject(Router)
  MAX_TOTAL_SIZE_MB = 1;

  ngOnInit(): void {
    const korisnikString = localStorage.getItem('ulogovaniKorisnik');
    if (korisnikString) {
      const korisnik = JSON.parse(korisnikString);
      this.vikendica.vlasnik = korisnik.username;
    }
  }

  formSubmitted = false;

  @ViewChild(MapaComponent) mapaComponent!: MapaComponent;

  onFileChange(event: any) {
    this.slikeFajlovi = Array.from(event.target.files);
    this.slikaIzabrana = this.slikeFajlovi.length > 0;

    // Provera ukupne veličine fajlova
    const totalSize = this.slikeFajlovi.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > this.MAX_TOTAL_SIZE_MB * 1024 * 1024) {
      alert(`Ukupna veličina fajlova ne sme biti veća od ${this.MAX_TOTAL_SIZE_MB} MB.`);
      this.slikeFajlovi = [];
      this.slikaIzabrana = false;
    }

  }

  dodajVikendicu(): void {
    this.formSubmitted = true;
    this.vikendica.x = this.mapaComponent.x;
    this.vikendica.y = this.mapaComponent.y;

    const validna =
      this.vikendica.naziv.trim() !== '' &&
      this.vikendica.mesto.trim() !== '' &&
      this.vikendica.telefon.trim() !== '' &&
      this.vikendica.opis.trim() !== '' &&
      this.vikendica.cenaLeto !== null &&
      this.vikendica.cenaZima !== null &&
      this.vikendica.x !== null &&
      this.vikendica.y !== null ;

    if (!validna) {
      return;
    }
    console.log('Dodajem vikendicu:', this.vikendica);
    this.servis.dodajVikendicu(this.vikendica, this.slikeFajlovi).subscribe(
      (data)=>{
        if (data>0){
          alert('Vikendica uspesno dodata!)');
          this.ruter.navigate(['/mojevikendice'])
        } else{
          alert('GRESKA!');
        }
      }
    )
  }

  onUcitajJson(event: any): void {
    const fajl: File = event.target.files[0];
    if (!fajl) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const podaci = JSON.parse(reader.result as string);

        // Validacija obaveznih polja
        if (!podaci.naziv || !podaci.mesto || !podaci.telefon || !podaci.opis ||
            podaci.cenaLeto == null || podaci.cenaZima == null ||
            podaci.x == null || podaci.y == null) {
          alert('JSON fajl mora sadržati sva obavezna polja.');
          return;
        }

        // Popuni formu
        this.vikendica.naziv = podaci.naziv;
        this.vikendica.mesto = podaci.mesto;
        this.vikendica.telefon = podaci.telefon;
        this.vikendica.opis = podaci.opis;
        this.vikendica.cenaLeto = podaci.cenaLeto;
        this.vikendica.cenaZima = podaci.cenaZima;
        this.vikendica.x = podaci.x;
        this.vikendica.y = podaci.y;

        // Postavi koordinate i na mapu
        if (this.mapaComponent) {
          this.mapaComponent.x = podaci.x;
          this.mapaComponent.y = podaci.y;
        }

      } catch (err) {
        console.error('Greška prilikom parsiranja JSON fajla:', err);
        alert('Neispravan JSON fajl.');
      }
    };

    reader.readAsText(fajl);
  }

}
