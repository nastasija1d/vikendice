import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RezervacijaService } from '../../services/rezervacija.service';
import { statistikaVikendice } from '../../models/statistikaVikendice';

import Chart from 'chart.js/auto';
import { ChartOptions, ChartDataset } from 'chart.js';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  @ViewChild('barChartCanvas') barChartCanvas!: ElementRef<HTMLCanvasElement>;
  servis = inject(RezervacijaService);
  chart!: Chart;

  ngOnInit(): void {
    const korisnikString = localStorage.getItem('ulogovaniKorisnik');
    if (korisnikString) {
      const korisnik = JSON.parse(korisnikString);
      this.servis.dohvatiRezPoMesecima(korisnik.username).subscribe((data) => {
        console.log('Podaci sa servera:', data);
        this.createChart(data);
      });
    }
  }

  createChart(podaci: statistikaVikendice[]) {
    const meseci = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'];

    const colors = [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)'
    ];

    const datasets: ChartDataset<'bar'>[] = podaci.map((vik, index) => ({
      label: vik.naziv,
      data: vik.meseci,
      backgroundColor: colors[index % colors.length]
    }));

    // Ako postoji stari grafikon, uništi ga
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.barChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: meseci,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            align: 'start'
          },
          title: {
            display: true,
            text: 'Broj rezervacija po mesecima'
          }
        }
      } as ChartOptions<'bar'>
    });
  }
}
