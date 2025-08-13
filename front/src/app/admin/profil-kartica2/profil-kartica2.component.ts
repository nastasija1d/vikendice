import { Component, inject, Input } from '@angular/core';
import { Korisnik } from '../../models/korisnik';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil-kartica2',
  standalone: true,
  imports: [],
  templateUrl: './profil-kartica2.component.html',
  styleUrl: './profil-kartica2.component.css'
})
export class ProfilKartica2Component {
  @Input() korisnik: Korisnik;
  servis = inject(AdminService)
  ruter = inject(Router)

  izmeni(){
    this.ruter.navigate(['/admin/azuriraj', this.korisnik.username]);
  }

  blokiraj(){
    this.servis.blokirajKorisnika(this.korisnik.username).subscribe(
        (data)=>{
          if (data == 1){
            this.korisnik.status = 3; 
          }
        }
      )
  }
}
