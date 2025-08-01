import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MapaComponent } from '../mapa/mapa.component';
import { Vikendica } from '../../models/vikendica';
import { VikendicaService } from '../../services/vikendica.service';


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
        } else{
          alert('GRESKA!');
        }
      }
    )
  }
}
