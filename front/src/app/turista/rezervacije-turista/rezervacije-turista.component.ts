import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Korisnik } from '../../models/korisnik';
import { Rezervacija } from '../../models/rezervacija';
import { RezervacijaService } from '../../services/rezervacija.service';
import { FormsModule } from '@angular/forms';
import { ZvezdiceComponent } from "../zvezdice/zvezdice.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rezervacije-turista',
  standalone: true,
  imports: [CommonModule, FormsModule, ZvezdiceComponent, RouterLink],
  templateUrl: './rezervacije-turista.component.html',
  styleUrl: './rezervacije-turista.component.css'
})
export class RezervacijeTuristaComponent implements OnInit{

  korisnik: Korisnik
  aktivne: Rezervacija[]
  arhiva: Rezervacija[]
  otkazane: Rezervacija[]
  servis = inject(RezervacijaService)

  ngOnInit(){
    const kor = localStorage.getItem('ulogovaniKorisnik')
    this.korisnik = JSON.parse(kor)
    this.ucitajSveRezervacije()
  }

  activeTab: string = 'aktivne';
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  otkazi(r:Rezervacija){
    const sad = new Date();
    const datumOD = new Date(r.datumOD);
    datumOD.setHours(14, 0, 0, 0);

    const diffMs = datumOD.getTime() - sad.getTime();
    const brojNocenja = diffMs / (1000 * 60 * 60 * 24);
    if(brojNocenja <= 1){
      alert("Mozete otkazati rezervaciju najkasnije do 14:00 prethodnog dana!")
      return
    }
    this.servis.otkaziRezervaciju(r.id).subscribe(
      (data)=>{
        if (data>0){
          alert("Rezervacija otkazana!")
          this.ucitajSveRezervacije()
        }
      }
    )
  }

  statusRezervacije(id : number) : string{
    if (id == 0) return 'na cekanju'
    if (id == 1) return 'otkazana'
    if (id == 2) return 'odbijena'
    if (id == 3) return 'potvrdjena'
    if (id == 4) return 'u toku'
    if (id == 5) return 'zavrsena'
    return 'greska'
  }

  ucitajSveRezervacije(){
    this.servis.dohvatiAktivneTurista(this.korisnik.username).subscribe((data) => {
      this.aktivne = data.filter(r => r.status === 0 || r.status === 3 || r.status === 4);
      this.otkazane = data.filter(r => r.status === 1 || r.status === 2);
      this.arhiva = data.filter(r => r.status === 5);
    });
  }

  formaVidljiva: boolean = false;
  ocena: number = 0;
  ocenaText: string = '';
  aktivnaRezervacijaZaOcenjivanje: Rezervacija = null;

  oceni(r:Rezervacija){
    if (r.status != 5) return;
    this.formaVidljiva = true;
    this.aktivnaRezervacijaZaOcenjivanje = r;
  }

  zatvoriFormu(): void {
    this.formaVidljiva = false;
    this.ocena = 0;
    this.ocenaText = '';
    this.aktivnaRezervacijaZaOcenjivanje = null;
  }

  postaviOcenu(izabrana: number): void {
    this.ocena = izabrana;
  }

  posaljiOcenu(): void {
    this.aktivnaRezervacijaZaOcenjivanje.ocena = this.ocena
    this.aktivnaRezervacijaZaOcenjivanje.ocenaText = this.ocenaText

    this.servis.oceniRezervaciju(this.aktivnaRezervacijaZaOcenjivanje).subscribe(
      (data) => {
        if (data == 1){
          this.ucitajSveRezervacije();
        }
      }
    )

    this.zatvoriFormu();
  }


}
