import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Vikendica } from '../models/vikendica';

@Injectable({
  providedIn: 'root'
})
export class VikendicaService {

  http = inject(HttpClient)
  url = 'http://localhost:8080/vikendica';

  dodajVikendicu(vikendica: Vikendica, slike: File[]) {
    const formData = new FormData();
    
    formData.append('naziv', vikendica.naziv);
    formData.append('mesto', vikendica.mesto);
    formData.append('telefon', vikendica.telefon);
    formData.append('opis', vikendica.opis);
    formData.append('cena_leto', vikendica.cena_leto?.toString() ?? '');
    formData.append('cena_zima', vikendica.cena_zima?.toString() ?? '');
    formData.append('x', vikendica.x?.toString() ?? '');
    formData.append('y', vikendica.y?.toString() ?? '');
    formData.append('vlasnik', vikendica.vlasnik);

    if (slike && slike.length > 0) {
      slike.forEach(slika => {
        formData.append('slike', slika);
      });
    }

    return this.http.post<number>(`${this.url}/dodaj`, formData);
  }
}

