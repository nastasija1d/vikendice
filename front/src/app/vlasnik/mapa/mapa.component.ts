import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';

// Fix za Leaflet ikone
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
  styleUrls: ['./mapa.component.css']  // ispravljeno sa styleUrl na styleUrls
})
export class MapaComponent implements AfterViewInit, OnChanges {
  private map!: L.Map;
  private marker!: L.Marker;
  
  // Defaultne vrednosti
  private defaultX = 44.7866;
  private defaultY = 20.4489;
  private defaultZoom = 14;

  private _x = this.defaultX;
  private _y = this.defaultY;

  @Input() 
  set x(value: number) {
    this._x = value ?? this.defaultX;
    this.updateMarker();
  }
  get x(): number {
    return this._x;
  }

  @Input() 
  set y(value: number) {
    this._y = value ?? this.defaultY;
    this.updateMarker();
  }
  get y(): number {
    return this._y;
  }

  // Novi inputi za širinu i visinu sa default vrednostima
  @Input() width: number = 500;
  @Input() height: number = 300;

  @Output() koordinate = new EventEmitter<{ x: number, y: number }>();

  ngAfterViewInit(): void {
    this.applyMapSize();
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && (changes['x'] || changes['y'])) {
      this.updateMarker();
    }
    if (changes['width'] || changes['height']) {
      this.applyMapSize();
    }
  }

  private applyMapSize(): void {
    const mapDiv = document.getElementById('map');
    if (mapDiv) {
      mapDiv.style.width = this.width + 'px';
      mapDiv.style.height = this.height + 'px';
      if (this.map) {
        this.map.invalidateSize(); // osvežava Leaflet mapu nakon promene dimenzija
      }
    }
  }

  private initMap(): void {
    this.map = L.map('map').setView([this._x, this._y], this.defaultZoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this._x = e.latlng.lat;
      this._y = e.latlng.lng;
      this.updateMarker();
      this.koordinate.emit({ x: this._x, y: this._y });
    });

    this.updateMarker();
  }

  private updateMarker(): void {
    if (!this.map) return;

    const latLng = L.latLng(this._x, this._y);
    
    if (this.marker) {
      this.marker.setLatLng(latLng);
    } else {
      this.marker = L.marker(latLng).addTo(this.map);
    }

    this.map.setView(latLng, this.map.getZoom());
  }
}
