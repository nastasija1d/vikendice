import { Component } from '@angular/core';
import { KorisnikService } from '../../services/korisnik.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
        this.greska = '';
        this.username = '';
        this.lozinka = '';
        if(data.status == 0){
          alert("Admin jos uvek nije odobrio vas zahtev!")
          return
        }
        if(data.status == 2){
          alert("Vas zahtev je odbijen!")
          return
        }
        if(data.status == 3){
          alert("Vas profil je blokiran!")
          return
        }
        localStorage.setItem('ulogovaniKorisnik', JSON.stringify(data));
        this.router.navigate(['/profil']);
      }else{
        this.greska = 'Pogrešno korisničko ime ili lozinka.';
      }
    });
  }
}
