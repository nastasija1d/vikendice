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
      this.vikendica.cena_leto !== null &&
      this.vikendica.cena_zima !== null &&
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
