import { Component } from '@angular/core';
import { KorisnikService } from '../../services/korisnik.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  lozinka = '';
  greska = '';

  constructor(private servis: KorisnikService, private router: Router) {}

  login() {
    this.servis.login(this.username, this.lozinka).subscribe((data)=>{
      if(data){
        localStorage.setItem('ulogovaniKorisnik', JSON.stringify(data));
        this.greska = '';
        this.router.navigate(['/profil']);
      }else{
        this.greska = 'Pogrešno korisničko ime ili lozinka.';
      }
    });
  }
}
