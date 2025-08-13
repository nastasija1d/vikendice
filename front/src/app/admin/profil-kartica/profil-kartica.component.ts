import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Korisnik } from '../../models/korisnik';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-profil-kartica',
  standalone: true,
  imports: [],
  templateUrl: './profil-kartica.component.html',
  styleUrl: './profil-kartica.component.css'
})
export class ProfilKarticaComponent {
  @Input() korisnik: Korisnik;
  @Output() uklonjen = new EventEmitter<string>();
  servis = inject(AdminService)

  prihvati(){
    this.servis.prihvatiZahtev(this.korisnik.username).subscribe(
      (data)=>{
        if (data == 1){
          this.uklonjen.emit(this.korisnik.username);
        }
      }
    )
  }

  odbi(){
    this.servis.odbiZahtev(this.korisnik.username).subscribe(
        (data)=>{
          if (data == 1){
            this.uklonjen.emit(this.korisnik.username);
          }
        }
      )
  }

}
