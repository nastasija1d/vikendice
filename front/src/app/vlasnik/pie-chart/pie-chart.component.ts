import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

export class Proizvodjac {
  naziv!: string;
  broj!: number;
}

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css' 
})
export class PieChartComponent implements OnChanges {
  @Input() brojRadni = 0;
  @Input() brojVikend = 0;
  @Input() naziv = 'vikendica';

  @Input() width = 400;
  @Input() height = 400;
  data: Proizvodjac[] = [];

  colors = [
    '#2e4f4f', 
    '#a0892c'  
  ];

  arcs: Array<{ startAngle: number; endAngle: number; color: string; naziv: string; broj: number }> = [];

  hoveredIndex: number | null = null;
  tooltipVisible = false;
  legendHeight = 60;
  tooltipX = 0;
  tooltipY = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['brojRadni'] || changes['brojVikend']) {
      this.rebuildDataAndArcs();
    }
  }

  private rebuildDataAndArcs() {
    this.data = [
      { naziv: 'Radni dani', broj: this.brojRadni },
      { naziv: 'Vikend', broj: this.brojVikend }
    ];

    this.calculateArcs();
  }

  private calculateArcs() {
    this.arcs = [];
    const total = this.data.reduce((sum, item) => sum + item.broj, 0);
    let acc = 0;

    if (total === 0) {
      this.arcs.push({
        startAngle: 0,
        endAngle: 359.9999,
        color: '#d3d3d3',
        naziv: 'Nema podataka',
        broj: 0
      });
      return;
    }

    if (this.brojVikend === 0 && this.brojRadni > 0) {
      this.arcs.push({
        startAngle: 0,
        endAngle: 359.9999,
        color: '#2e4f4f',
        naziv: 'Radni dani',
        broj: this.brojRadni
      });
      return;
    }

    if (this.brojRadni === 0 && this.brojVikend > 0) {
      this.arcs.push({
        startAngle: 0,
        endAngle: 359.9999,
        color: '#a0892c',
        naziv: 'Vikend',
        broj: this.brojVikend
      });
      return;
    }

    this.arcs = this.data.map((item, i) => {
      const slice = (item.broj / total) * 360;
      const arc = {
        startAngle: acc,
        endAngle: acc + slice,
        color: this.colors[i % this.colors.length],
        naziv: item.naziv,
        broj: item.broj
      };
      acc += slice;
      return arc;
    });
  }

  polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
    const rad = (angle - 90) * Math.PI / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  describeArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number): string {
    const start = this.polarToCartesian(cx, cy, radius, endAngle);
    const end = this.polarToCartesian(cx, cy, radius, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y} L ${cx} ${cy} Z`;
  }

  onMouseEnter(event: MouseEvent, idx: number) {
    this.hoveredIndex = idx;
    this.tooltipVisible = true;
    this.tooltipX = event.clientX;
    this.tooltipY = event.clientY;
  }

  onMouseLeave() {
    this.hoveredIndex = null;
    this.tooltipVisible = false;
  }

  moveTooltip(event: MouseEvent) {
    this.tooltipX = event.clientX + 10;
    this.tooltipY = event.clientY + 10;
  }

  getRadius(idx: number): number {
    const base = Math.min(this.width, this.height) / 2;
    return this.hoveredIndex === idx ? base * 1.1 : base;
  }

  hasData(): boolean {
    return (this.brojRadni + this.brojVikend) > 0;
  }
}
