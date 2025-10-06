import { Component } from '@angular/core';

@Component({
  selector: 'app-pocetna',
  standalone: true,
  imports: [],
  templateUrl: './pocetna.component.html',
  styleUrl: './pocetna.component.css'
})
export class PocetnaComponent {
  stats = {
    totalVikendice: 128,
    totalTuristi: 892,
    totalVlasnici: 47,
    rezervacije: {
      '24h': 12,
      '7d': 63,
      '30d': 214
    }
  };

}
