import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-zvezdice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zvezdice.component.html',
  styleUrl: './zvezdice.component.css'
})
export class ZvezdiceComponent {
  @Input() ocena?: number; // Ako je zadato, komponenta je u "output" režimu
  @Output() ocenaIzabrana = new EventEmitter<number>();

  hoverIndex = 0;
  aktivnaOcena = 0;

  constructor() {
    this.aktivnaOcena = this.ocena ?? 0;
  }

  ngOnChanges() {
    this.aktivnaOcena = this.ocena ?? 0;
  }

  odaberi(ocena: number) {
    if (this.ocena === undefined) {
      this.aktivnaOcena = ocena;
      this.ocenaIzabrana.emit(ocena);
    }
  }

  naHover(index: number) {
    if (this.ocena === undefined) {
      this.hoverIndex = index;
    }
  }

  napusti() {
    if (this.ocena === undefined) {
      this.hoverIndex = 0;
    }
  }

  // Da li je zvezdica puna, pola ili prazna
  tipZvezdice(index: number): 'puna' | 'pola' | 'prazna' {
    const aktivna = this.ocena !== undefined ? this.ocena : (this.hoverIndex || this.aktivnaOcena);
    if (aktivna >= index + 1) return 'puna';
    if (aktivna >= index + 0.5) return 'pola';
    return 'prazna';
  }
}