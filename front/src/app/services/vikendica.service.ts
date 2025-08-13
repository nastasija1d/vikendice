import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Vikendica } from '../models/vikendica';
import { Ocena } from '../models/ocena';

@Injectable({
  providedIn: 'root'
})
export class VikendicaService {

  http = inject(HttpClient)
  url = 'http://localhost:8080/vikendica';

  dohvatiVikendicu(id: number){
    return this.http.get<Vikendica>(this.url + '/dohvati/' + id);
  }

  dohvatiOceneZaVikendicu(id: number){
    return this.http.get<Ocena[]>(this.url + "/dohvatiocene/" + id)
  }

  dohvatiSveVikendice(searchTerm?: string){
    let params = new HttpParams();
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }

    return this.http.get<Vikendica[]>(this.url +'/sve',{ params });
  }

  dohvatiSveVikendiceZaKorisnika(id : string){
    return this.http.get<Vikendica[]>(this.url + '/dohvatizakorisnika/' + id);
  }

  dodajSlikeVikendici(id: number, slike: File[]) {
    const formData = new FormData();
    if (slike && slike.length > 0) {
      slike.forEach(slika => {
        formData.append('slike', slika);
      });
    }
    return this.http.post<string[]>(`${this.url}/dodajslike/${id}`, formData);
  }

  obrisiSliku(putanjaSlike: string){
    const params = new HttpParams().set('putanja', putanjaSlike);
    console.log('Brisanje slike:', putanjaSlike);
    return this.http.delete<number>(
      `${this.url}/obrisisliku`,
      { params }
    );
  }

  dodajVikendicu(vikendica: Vikendica, slike: File[]) {
    const formData = new FormData();
    
    formData.append('naziv', vikendica.naziv);
    formData.append('mesto', vikendica.mesto);
    formData.append('telefon', vikendica.telefon);
    formData.append('opis', vikendica.opis);
    formData.append('cena_leto', vikendica.cenaLeto?.toString() ?? '');
    formData.append('cena_zima', vikendica.cenaZima?.toString() ?? '');
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

  azurirajVikendicu(vikendica: Vikendica, id: number) {
    const formData = new FormData();
    
    formData.append('naziv', vikendica.naziv);
    formData.append('mesto', vikendica.mesto);
    formData.append('telefon', vikendica.telefon);
    formData.append('opis', vikendica.opis);
    formData.append('cena_leto', vikendica.cenaLeto?.toString() ?? '');
    formData.append('cena_zima', vikendica.cenaZima?.toString() ?? '');
    formData.append('x', vikendica.x?.toString() ?? '');
    formData.append('y', vikendica.y?.toString() ?? '');
    formData.append('vlasnik', vikendica.vlasnik);


    return this.http.post<number>(this.url + "/azuriraj/" + id, formData);
  }
}

