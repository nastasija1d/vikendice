import { Korisnik } from './../../models/korisnik';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VikendicaService } from '../../services/vikendica.service';
import { Vikendica } from '../../models/vikendica';
import { CommonModule } from '@angular/common';
import { MapaComponent } from '../../vlasnik/mapa/mapa.component';
import { CalendarComponent } from "../calendar/calendar.component";
import { FormsModule } from '@angular/forms';
import { Rezervacija } from '../../models/rezervacija';
import { Ocena } from '../../models/ocena';

@Component({
  selector: 'app-vikendica-stranica',
  standalone: true,
  imports: [CommonModule, MapaComponent, CalendarComponent, FormsModule],
  templateUrl: './vikendica-stranica.component.html',
  styleUrl: './vikendica-stranica.component.css'
})
export class VikendicaStranicaComponent implements OnInit {

  ruta = inject(ActivatedRoute)
  servis = inject(VikendicaService)
  ruter = inject(Router)
  vikendica: Vikendica
  korisnik: Korisnik
  rezervacija : Rezervacija
  datumOD: string;
  datumDO: string;
  cena:number;
  ocene: Ocena[]

  ngOnInit(): void {
    this.korisnik = JSON.parse(localStorage.getItem('ulogovaniKorisnik'));
    const id = this.ruta.snapshot.paramMap.get('id');
    this.servis.dohvatiVikendicu(Number(id)).subscribe(
      (data) => {
        this.vikendica = data;
      }
    ); 
    this.cena = 0; 
    this.servis.dohvatiOceneZaVikendicu(Number(id)).subscribe(
      (data) => {
        this.ocene = data;
      }
    )
  }

  odrasli: number = 1; 
  deca: number = 0;   

  odrasliOpcije: number[] = Array.from({ length: 10 }, (_, i) => i + 1); 
  decaOpcije: number[] = Array.from({ length: 11 }, (_, i) => i);    

  rezervisi() {
    this.rezervacija = new Rezervacija();
    this.rezervacija.vikendica = this.vikendica;
    this.rezervacija.turista = this.korisnik.username;
    this.rezervacija.odrasli = this.odrasli;
    this.rezervacija.deca = this.deca;
    this.rezervacija.datumOD = this.datumOD;
    this.rezervacija.datumDO = this.datumDO;
    this.rezervacija.kartica = this.korisnik.kartica;
    this.rezervacija.status = 0;
    console.log(this.rezervacija);
    if (this.datumOD=='' || this.datumDO=='') {
      alert("Morate izabrati datume!");
      return;
    }
    this.ruter.navigate(['/napravirezervaciju'],{state: { rezervacija: this.rezervacija}})
  }


  onDatumiChange($event: { datumOD: string; datumDO: string; }) {
    this.datumOD = $event.datumOD;
    this.datumDO = $event.datumDO;
    this.izracunajCenu()
  }

  izracunajCenu(){
    const datumOD = new Date(this.datumOD);
    const datumDO = new Date(this.datumDO);

    datumOD.setHours(0, 0, 0, 0);
    datumDO.setHours(0, 0, 0, 0);

    const diffMs = datumDO.getTime() - datumOD.getTime();
    const brojNocenja = diffMs / (1000 * 60 * 60 * 24);
    if (brojNocenja <= 0) return;

    const letnjiMeseci = [4, 5, 6, 7]; // maj (4) do avgust (7)
    const mesecRezervacije = datumOD.getMonth();

    const cenaPoNocenju = letnjiMeseci.includes(mesecRezervacije)
      ? this.vikendica.cenaLeto
      : this.vikendica.cenaZima;

    const brojOsoba = Number(this.odrasli) + Number(this.deca)*0.5

    this.cena = Math.round(brojNocenja * brojOsoba * cenaPoNocenju);
  }

}
