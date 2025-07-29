import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KorisnikService } from '../../services/korisnik.service';

@Component({
  selector: 'app-promena-lozinke',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './promena-lozinke.component.html',
  styleUrl: './promena-lozinke.component.css'
})
export class PromenaLozinkeComponent {
staraLozinka: string = '';
novaLozinka: string = '';
ponovljenaNovaLozinka: string = '';
username: string = '';
greska: string = '';
servis = inject(KorisnikService);

// Regex kao za registraciju:
lozinkaRegex = /^(?=.*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]|;:'",.<>/?])[A-Za-z][A-Za-z\d!@#$%^&*()\-_=+{}[\]|;:'",.<>/?]{5,9}$/;
    
promeniLozinku() {
  // 1. Provera da nova i stara nisu iste
  if (this.staraLozinka === this.novaLozinka) {
    this.greska = 'Nova lozinka ne sme biti ista kao stara.';
    return;
  }

  // 2. Provera regex forme
  if (!this.lozinkaRegex.test(this.novaLozinka)) {
    this.greska = 'Nova lozinka nije u ispravnom formatu.';
    return;
  }

  // 3. Provera da se nova poklapa sa ponovljenom
  if (this.novaLozinka !== this.ponovljenaNovaLozinka) {
    this.greska = 'Nova lozinka i potvrda lozinke se ne poklapaju.';
    return;
  }

  this.servis.promeniLozinku(this.username, this.staraLozinka, this.novaLozinka).subscribe(
    (data)=>{
      if (data==1){

      }else{
        this.greska = 'Uneta netacna stara lozinka!';
      }
    }
  )
}

}
