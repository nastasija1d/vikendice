import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Vikendica } from '../../models/vikendica';
import { Router } from '@angular/router';
import { ZvezdiceComponent } from "../zvezdice/zvezdice.component";

@Component({
  selector: 'app-vikendica-kartica',
  standalone: true,
  imports: [CommonModule, ZvezdiceComponent],
  templateUrl: './vikendica-kartica.component.html',
  styleUrl: './vikendica-kartica.component.css'
})
export class VikendicaKarticaComponent {
  @Input() vikendica: Vikendica;
  aktivnaSlikaIndex: number = 0;
  ruter = inject(Router)
  

  sledeca() {
    if (!this.vikendica?.slike?.length) return;
    this.aktivnaSlikaIndex = (this.aktivnaSlikaIndex + 1) % this.vikendica.slike.length;
  }

  prethodna() {
    if (!this.vikendica?.slike?.length) return;
    this.aktivnaSlikaIndex = (this.aktivnaSlikaIndex - 1 + this.vikendica.slike.length) % this.vikendica.slike.length;
  }

  detaljnije() {
    this.ruter.navigate(['/vikendica', this.vikendica.id]);
  }

}
