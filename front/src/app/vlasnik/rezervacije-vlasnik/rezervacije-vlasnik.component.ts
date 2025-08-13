import { Component, inject, OnInit } from '@angular/core';
import { Rezervacija } from '../../models/rezervacija';
import { Korisnik } from '../../models/korisnik';
import { RezervacijaService } from '../../services/rezervacija.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rezervacije-vlasnik',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rezervacije-vlasnik.component.html',
  styleUrl: './rezervacije-vlasnik.component.css'
})
export class RezervacijeVlasnikComponent implements OnInit{

  korisnik: Korisnik
  aktivne: Rezervacija[]
  arhiva: Rezervacija[]
  servis = inject(RezervacijaService)

  ngOnInit(){
    const kor = localStorage.getItem('ulogovaniKorisnik')
    this.korisnik = JSON.parse(kor)
    this.ucitajSveRezervacije()
    console.log(this.aktivne)
  }

  activeTab: string = 'aktivne';
  setActiveTab(tab: string): void {
    this.activeTab = tab;
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
    this.servis.dohvatiAktivneVlasnik(this.korisnik.username).subscribe((data) => {
      this.aktivne = data.filter(r => r.status === 0)
      this.arhiva = data.filter(r => r.status > 0);
    });
  }

  kriterijumSortiranja: string = 'datumOD'; // podrazumevani kriterijum

  sortirajAktivne() {
    this.aktivne.sort((a, b) => {
      switch (this.kriterijumSortiranja) {
        case 'datumOD':
          return b.datumOD.localeCompare(a.datumOD);
        case 'vikendica':
          return a.vikendica.naziv.localeCompare(b.vikendica.naziv);
        case 'turista':
          return a.turistaKlasa.ime.localeCompare(b.turistaKlasa.ime);
        default:
          return 0;
      }
    });
  }

  kriterijumSortiranja2: string = 'datumOD'; // podrazumevani kriterijum

  sortirajArhiva() {
    this.arhiva.sort((a, b) => {
      switch (this.kriterijumSortiranja2) {
        case 'datumOD':
          return b.datumOD.localeCompare(a.datumOD);
        case 'vikendica':
          return a.vikendica.naziv.localeCompare(b.vikendica.naziv);
        case 'turista':
          return a.turistaKlasa.ime.localeCompare(b.turistaKlasa.ime);
        default:
          return 0;
      }
    });
  }

  prihvati(id: Rezervacija) {
    this.servis.potvrdiRezervaciju(id).subscribe(
      (data)=>{
        if (data>0){
          this.ucitajSveRezervacije()
        }else{
          alert("Vec postoji rezervacija u dato vreme za datu vikendicu!")
        }
      }
    )
  }

  modalVidljiv: boolean = false;
  odabranaRezervacijaId: number = -1;
  komentarOdbijanje: string = '';

  otvoriOdbijanje(id: number): void {
    this.odabranaRezervacijaId = id;
    this.komentarOdbijanje = '';
    this.modalVidljiv = true;
  }

  zatvoriModal(): void {
    this.modalVidljiv = false;
    this.komentarOdbijanje = '';
    this.odabranaRezervacijaId = -1;
  }

  potvrdiOdbijanje(): void {
    if (!this.komentarOdbijanje.trim()) {
      alert("Komentar za odbijanje je obavezan.");
      return;
    }
    this.servis.odbijRezervaciju(this.odabranaRezervacijaId, this.komentarOdbijanje).subscribe(
      (data)=>{
        if(data>0){
          this.ucitajSveRezervacije()
          this.zatvoriModal()
        }
      }
    )

  }
}
