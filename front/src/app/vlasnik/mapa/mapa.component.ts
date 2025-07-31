import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';
import * as L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'marker-icon-2x.png',
  iconUrl: 'marker-icon.png',
  shadowUrl: 'marker-shadow.png'
});

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [LeafletModule],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent implements AfterViewInit {
  map!: L.Map;
  marker!: L.Marker;
  x: number = 0;
  y: number = 0;

  @Output() koordinate = new EventEmitter<{ x: number, y: number }>();

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([44.7866, 20.4489], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.x = e.latlng.lat;
      this.y = e.latlng.lng;

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map);
      }

      this.koordinate.emit({ x: this.x, y: this.y });
    });
  }
}