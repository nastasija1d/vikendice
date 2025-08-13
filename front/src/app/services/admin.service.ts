import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Korisnik } from '../models/korisnik';
import { Vikendica } from '../models/vikendica';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private url = 'http://localhost:8080/admin';

  constructor(private http: HttpClient) { }

  dohvatiSveZahteve(){
    return this.http.get<Korisnik[]>(this.url + "/svizahtevi");
  }

  dohvatiSveKorisnike(){
    return this.http.get<Korisnik[]>(this.url + "/svikorisnici");
  }

  dohvatiSveVikendice(){
    return this.http.get<Vikendica[]>(this.url + "/svevikendice");
  }

  prihvatiZahtev(username : string){
    return this.http.post<number>(this.url + '/prihvati', username)
  }

  odbiZahtev(username : string){
    return this.http.post<number>(this.url + '/odbi', username)
  }

  blokirajKorisnika(username : string){
    return this.http.post<number>(this.url + '/blokiraj', username)
  }

  blokirajVikendicu(id: number){
    return this.http.post<number>(this.url + "/blokirajvikendicu", id)
  }

  login(username: string, lozinka: string) {
    return this.http.post<Korisnik>(this.url + '/login', { username, lozinka });
  }
}
