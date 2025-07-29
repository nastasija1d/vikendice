import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Korisnik } from '../models/korisnik';

@Injectable({
  providedIn: 'root'
})
export class KorisnikService {

  private url = 'http://localhost:8080/korisnik';

  constructor(private http: HttpClient) { }

  registrujKorisnika(formData:FormData){
    return this.http.post<number>(this.url + '/registruj', formData);
  }

  login(username: string, lozinka: string) {
  return this.http.post<Korisnik>(this.url + '/login', { username, lozinka });
  }

  promeniLozinku(username: string, staraLozinka: string, novaLozinka: string) {
  return this.http.post<number>(this.url + '/promeniLozinku', {
    username: username,
    staraLozinka: staraLozinka,
    novaLozinka: novaLozinka
  });
}


}
