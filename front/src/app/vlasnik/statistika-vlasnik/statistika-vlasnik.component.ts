import { Component, inject, OnInit } from '@angular/core';
import { BarChartComponent } from "../bar-chart/bar-chart.component";
import { PieChartComponent } from "../pie-chart/pie-chart.component";
import { statistikaVikendice } from '../../models/statistikaVikendice';
import { RezervacijaService } from '../../services/rezervacija.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistika-vlasnik',
  standalone: true,
  imports: [BarChartComponent, CommonModule, PieChartComponent],
  templateUrl: './statistika-vlasnik.component.html',
  styleUrl: './statistika-vlasnik.component.css'
})
export class StatistikaVlasnikComponent implements OnInit{

  pieChartovi : statistikaVikendice[]
  servis = inject(RezervacijaService)

  ngOnInit(): void {
    const korisnikString = localStorage.getItem('ulogovaniKorisnik');
    if (korisnikString) {
      const korisnik = JSON.parse(korisnikString);
      this.servis.dohvatiRezPoVikendima(korisnik.username).subscribe((data) => {
        this.pieChartovi = data;
      });
    }
  }

}
