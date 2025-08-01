import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MapaComponent } from '../mapa/mapa.component';
import { VikendicaService } from '../../services/vikendica.service';
import { Vikendica } from '../../models/vikendica';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-azuriraj-vikendicu',
  standalone: true,
  imports: [CommonModule, FormsModule, MapaComponent],
  templateUrl: './azuriraj-vikendicu.component.html',
  styleUrl: './azuriraj-vikendicu.component.css'
})
export class AzurirajVikendicuComponent implements OnInit{
  vikendica = new Vikendica();
  slikeFajlovi: File[] = [];
  slikaIzabrana = false;
  servis = inject(VikendicaService)
  ruta = inject(ActivatedRoute);
  MAX_TOTAL_SIZE_MB = 1;
  dozvoljenPristup = true;
  id = 0;

  ngOnInit(): void {
    const korisnikString = localStorage.getItem('ulogovaniKorisnik');
    const id = this.ruta.snapshot.paramMap.get('id');
    this.id = Number(id);
    this.servis.dohvatiVikendicu(Number(id)).subscribe(
      (data) => {
        this.vikendica = data;
        if (korisnikString) {
          const korisnik = JSON.parse(korisnikString);
          if (this.vikendica.vlasnik !== korisnik.username) {
            this.dozvoljenPristup = false;
            alert('Nemate dozvolu da menjate ovu vikendicu!');
          }
        }else{
          this.dozvoljenPristup = false;
          alert('Nemate dozvolu da menjate ovu vikendicu!');
        }
      }
    );
    
  }

  formSubmitted = false;

  @ViewChild(MapaComponent) mapaComponent!: MapaComponent;
  ngAfterViewInit(): void {
    if (this.vikendica) {
      this.mapaComponent.x = this.vikendica.x ?? 0;
      this.mapaComponent.y = this.vikendica.y ?? 0;
    }
  }


  onFileChange(event: any) {
    this.slikeFajlovi = Array.from(event.target.files);

    // Provera ukupne veličine fajlova i onda salje slike na bek i odmah ih dodaje
    const totalSize = this.slikeFajlovi.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > this.MAX_TOTAL_SIZE_MB * 1024 * 1024) {
      alert(`Ukupna veličina fajlova ne sme biti veća od ${this.MAX_TOTAL_SIZE_MB} MB.`);
      this.slikeFajlovi = [];
      return;
    }
    this.servis.dodajSlikeVikendici(this.id, this.slikeFajlovi).subscribe(
      (data) => {
        if (data.length > 0) {
          this.vikendica.slike.push(...data);
        } else {
          alert('Greška prilikom dodavanja slika!');
        }
      });
  }

  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef;

    scrollLevo() {
      this.scrollContainer.nativeElement.scrollLeft -= 200;
    }

    scrollDesno() {
      this.scrollContainer.nativeElement.scrollLeft += 200;
    }

    obrisiSliku(putanja: string) {
      this.servis.obrisiSliku(putanja).subscribe(
        (data) => {
          if (data > 0) {
            this.vikendica.slike = this.vikendica.slike.filter(s => s !== putanja);
          } else {
            alert('Greška prilikom brisanja slike!');
          }})  
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
    this.servis.azurirajVikendicu(this.vikendica, this.id).subscribe(
      (data) =>{
        if (data > 0) {
          alert('Vikendica uspešno ažurirana!');
          this.formSubmitted = false;
        } else {
          alert('Greška prilikom ažuriranja vikendice!');
        }
      }
    )
  }
}
