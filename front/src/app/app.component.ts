import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Korisnik } from './models/korisnik';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front';
  korisnik: Korisnik

  isLoggedIn(){
    return localStorage.getItem('ulogovaniKorisnik') !== null;
  }

  getRole():number{
    const kor = localStorage.getItem('ulogovaniKorisnik')
    this.korisnik = JSON.parse(kor)
    console.log("TIP KORISNIKA: " + this.korisnik.tip)
    return this.korisnik.tip;
  }
}
