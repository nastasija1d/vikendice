import { Rezervacija } from './../models/rezervacija';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Vikendica } from '../models/vikendica';

@Injectable({
  providedIn: 'root'
})
export class RezervacijaService {

  private url = 'http://localhost:8080/rezervacije';
  http = inject(HttpClient)

  constructor() { }

  kreirajRezervaciju(r : Rezervacija ){
    return this.http.post<number>(this.url + '/napravi', r)
  }

  dohvatiAktivneTurista(id: string){
    return this.http.get<Rezervacija[]>(this.url + '/aktivneturista/' + id);
  }

  dohvatiAktivneVlasnik(id: string){
    return this.http.get<Rezervacija[]>(this.url + '/aktivnevlasnik/' + id);
  }

  otkaziRezervaciju(id : number){
    return this.http.post<number>(this.url + "/otkazi", id);
  }

  potvrdiRezervaciju(id : Rezervacija){
    return this.http.post<number>(this.url+"/potvrdi",id);
  }

  odbijRezervaciju(id : number, komentar : string){
    return this.http.post<number>(this.url+"/odbi",{
      id: id,
      komentar: komentar
    });
  }

  oceniRezervaciju(r : Rezervacija){
    return this.http.post<number>(this.url + "/oceni", r);
  }

  dohvatiZaVikendicu(id: number){
    return this.http.get<Rezervacija[]>(this.url+"/zavikendicu/"+id)
  }
  
}
