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

  dohvatiKorisnika(username: string){
    return this.http.get<Korisnik>(this.url + "/dohvati/" + username);
  }

  promeniLozinku(username: string, staraLozinka: string, novaLozinka: string) {
    return this.http.post<number>(this.url + '/promeniLozinku', {
      username: username,
      staraLozinka: staraLozinka,
      novaLozinka: novaLozinka
    });
  }

  izmeniKorisnika(korisnik: any, slika: File | null) {
    const formData = new FormData();

    formData.append('username', korisnik.username);
    formData.append('ime', korisnik.ime);
    formData.append('prezime', korisnik.prezime);
    formData.append('adresa', korisnik.adresa);
    formData.append('telefon', korisnik.telefon);
    formData.append('email', korisnik.email);
    formData.append('kartica', korisnik.kartica);

    if (slika instanceof File) {
      formData.append('slika', slika);
    }

    return this.http.post<Korisnik>(this.url + '/izmeniProfil', formData);
  }


}
