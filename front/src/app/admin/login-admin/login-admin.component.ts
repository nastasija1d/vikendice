import { Component } from '@angular/core';
import { KorisnikService } from '../../services/korisnik.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-admin.component.html',
  styleUrl: './login-admin.component.css'
})
export class LoginAdminComponent {
  username = '';
  lozinka = '';
  greska = '';

  constructor(private servis: AdminService, private router: Router) {}

  login() {
    this.servis.login(this.username, this.lozinka).subscribe((data)=>{
      if(data){
        this.greska = '';
        this.username = '';
        this.lozinka = '';
        localStorage.setItem('ulogovaniKorisnik', JSON.stringify(data));
        this.router.navigate(['/profil']);
      }else{
        this.greska = 'Pogrešno korisničko ime ili lozinka.';
      }
    });
  }
}
