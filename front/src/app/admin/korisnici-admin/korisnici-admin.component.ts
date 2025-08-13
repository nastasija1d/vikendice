import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Korisnik } from '../../models/korisnik';
import { ProfilKartica2Component } from '../profil-kartica2/profil-kartica2.component';

@Component({
  selector: 'app-korisnici-admin',
  standalone: true,
  imports: [CommonModule, ProfilKartica2Component],
  templateUrl: './korisnici-admin.component.html',
  styleUrl: './korisnici-admin.component.css'
})
export class KorisniciAdminComponent implements OnInit{

  activeTab: string = 'vlasnici';
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  vlasnici: Korisnik[]
  turisti: Korisnik[]

  servis = inject(AdminService)
  
  ngOnInit(): void {
    this.servis.dohvatiSveKorisnike().subscribe(
      (data)=>{
        this.vlasnici = data.filter(r => r.tip === 1)
        this.turisti = data.filter(r => r.tip === 2)
      }
    )
  }

}
