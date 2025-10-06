import { Routes } from '@angular/router';
import { RegistracijaComponent } from './opste/registracija/registracija.component';
import { LoginComponent } from './opste/login/login.component';
import { PromenaLozinkeComponent } from './opste/promena-lozinke/promena-lozinke.component';
import { ProfilComponent } from './opste/profil/profil.component';
import { DodajVikendicuComponent } from './vlasnik/dodaj-vikendicu/dodaj-vikendicu.component';
import { AzurirajVikendicuComponent } from './vlasnik/azuriraj-vikendicu/azuriraj-vikendicu.component';
import { MojeVikendiceComponent } from './vlasnik/moje-vikendice/moje-vikendice.component';
import { SveVikendiceComponent } from './turista/sve-vikendice/sve-vikendice.component';
import { VikendicaStranicaComponent } from './turista/vikendica-stranica/vikendica-stranica.component';
import { NapraviRezervacijuComponent } from './turista/napravi-rezervaciju/napravi-rezervaciju.component';
import { RezervacijeTuristaComponent } from './turista/rezervacije-turista/rezervacije-turista.component';
import { RezervacijeVlasnikComponent } from './vlasnik/rezervacije-vlasnik/rezervacije-vlasnik.component';
import { ZahteviAdminComponent } from './admin/zahtevi-admin/zahtevi-admin.component';
import { RezervacijeKalendarComponent } from './vlasnik/rezervacije-kalendar/rezervacije-kalendar.component';
import { KorisniciAdminComponent } from './admin/korisnici-admin/korisnici-admin.component';
import { VikendiceAdminComponent } from './admin/vikendice-admin/vikendice-admin.component';
import { AzurirajKorisnikaComponent } from './admin/azuriraj-korisnika/azuriraj-korisnika.component';
import { LoginAdminComponent } from './admin/login-admin/login-admin.component';
import { StatistikaVlasnikComponent } from './vlasnik/statistika-vlasnik/statistika-vlasnik.component';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';
import { PocetnaComponent } from './opste/pocetna/pocetna.component';

export const routes: Routes = [
  { path: '', component: PocetnaComponent},
  { path: 'registracija', component: RegistracijaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'promenalozinke', component: PromenaLozinkeComponent },

  { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },

  // vlasnik
  { path: 'dodajvikendicu', component: DodajVikendicuComponent, canActivate: [RoleGuard], data: { roles: [1] } },
  { path: 'mojevikendice', component: MojeVikendiceComponent, canActivate: [RoleGuard], data: { roles: [1] } },
  { path: 'azurirajvikendicu/:id', component: AzurirajVikendicuComponent, canActivate: [RoleGuard], data: { roles: [1] } },
  { path: 'rezervacijevlasnik', component: RezervacijeVlasnikComponent, canActivate: [RoleGuard], data: { roles: [1] } },
  { path: 'rezervacijekalendar', component: RezervacijeKalendarComponent, canActivate: [RoleGuard], data: { roles: [1] } },
  { path: 'statistika', component: StatistikaVlasnikComponent, canActivate: [RoleGuard], data: { roles: [1] } },

  // turista
  { path: 'vikendice', component: SveVikendiceComponent, canActivate: [RoleGuard], data: { roles: [2] } },
  { path: 'vikendica/:id', component: VikendicaStranicaComponent, canActivate: [RoleGuard], data: { roles: [2] } },
  { path: 'napravirezervaciju', component: NapraviRezervacijuComponent, canActivate: [RoleGuard], data: { roles: [2] } },
  { path: 'rezervacijeturista', component: RezervacijeTuristaComponent, canActivate: [RoleGuard], data: { roles: [2] } },

  // admin
  { path: 'admin/svizahtevi', component: ZahteviAdminComponent, canActivate: [RoleGuard], data: { roles: [0] } },
  { path: 'admin/svikorisnici', component: KorisniciAdminComponent, canActivate: [RoleGuard], data: { roles: [0] } },
  { path: 'admin/svevikendice', component: VikendiceAdminComponent, canActivate: [RoleGuard], data: { roles: [0] } },
  { path: 'admin/azuriraj/:username', component: AzurirajKorisnikaComponent, canActivate: [RoleGuard], data: { roles: [0] } },
  { path: 'admin/login', component: LoginAdminComponent }
];
