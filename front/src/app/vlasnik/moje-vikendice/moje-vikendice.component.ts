import { AfterViewInit, Component, ElementRef, inject, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Vikendica } from '../../models/vikendica';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapaComponent } from '../mapa/mapa.component';
import { VikendicaService } from '../../services/vikendica.service';
import { Router } from '@angular/router';
import { RezervacijaService } from '../../services/rezervacija.service';
import { Ocena } from '../../models/ocena';
import { Rezervacija } from '../../models/rezervacija';

@Component({
  selector: 'app-moje-vikendice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './moje-vikendice.component.html',
  styleUrl: './moje-vikendice.component.css'
})
export class MojeVikendiceComponent implements OnInit{
  vikendice: Vikendica[] = [];
  aktivnaSlika: { [id: number]: number } = {}; 
  servis = inject(VikendicaService);
  rezservis = inject(RezervacijaService)
  otvorenaDetaljnaVikendica: Vikendica | null = null;
  ruter = inject(Router)

  ngOnInit(): void {
    const korisnikString = localStorage.getItem('ulogovaniKorisnik');
    if (korisnikString) {
      const korisnik = JSON.parse(korisnikString);
      this.servis.dohvatiSveVikendiceZaKorisnika(korisnik.username).subscribe(
        (data)=>{
          this.vikendice = data;
          for(let v of this.vikendice){
            console.log(v);
          }
        }
      );
    }else{
      alert('Niste ulogovani!');
    }
  }

  prethodnaSlika(id: number, brojSlika: number) {
    this.aktivnaSlika[id] = (this.aktivnaSlika[id] - 1 + brojSlika) % brojSlika;
  }

  sledecaSlika(id: number, brojSlika: number) {
    this.aktivnaSlika[id] = (this.aktivnaSlika[id] + 1) % brojSlika;
  }

  otvoriDetalje(vik: Vikendica) {
    this.otvorenaDetaljnaVikendica = vik;
  }

  zatvoriDetalje() {
    this.otvorenaDetaljnaVikendica = null;
    this.prikazKomentara = false
    this.prikazRezervacija = false
  }

  izmeni(vik: Vikendica) {
    this.ruter.navigate(['/azurirajvikendicu', vik.id]);
  }

  dodajVikendicu(){
    this.ruter.navigate(['/dodajvikendicu']);
  }

  prikazKomentara: boolean = false;
  prikazRezervacija: boolean = false;
  komentari: Ocena[] = [];
  rezervacije: Rezervacija[] = [];

  prikaziKomentare() {
    this.prikazKomentara = true;
    this.prikazRezervacija = false;
    this.servis.dohvatiOceneZaVikendicu(this.otvorenaDetaljnaVikendica.id).subscribe(res => {
      this.komentari = res;
    });
  }

  prikaziRezervacije() {
    this.prikazRezervacija = true;
    this.prikazKomentara = false;
    this.rezservis.dohvatiZaVikendicu(this.otvorenaDetaljnaVikendica.id).subscribe(res => {
      this.rezervacije = res;
    });
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



}