import { Component, inject, OnInit } from '@angular/core';
import { Korisnik } from '../../models/korisnik';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { ProfilKarticaComponent } from '../profil-kartica/profil-kartica.component';

@Component({
  selector: 'app-zahtevi-admin',
  standalone: true,
  imports: [CommonModule, ProfilKarticaComponent],
  templateUrl: './zahtevi-admin.component.html',
  styleUrl: './zahtevi-admin.component.css'
})
export class ZahteviAdminComponent implements OnInit{

  korisnici : Korisnik[]
  servis = inject(AdminService)

  ngOnInit(): void {
    this.servis.dohvatiSveZahteve().subscribe((data)=>{this.korisnici=data})
  }

  ukloniKorisnika(username: string) {
    this.korisnici = this.korisnici.filter(k => k.username !== username);
  }

}
