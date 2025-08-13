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

export const routes: Routes = [
    { path: 'registracija', component: RegistracijaComponent },
    { path: 'login', component: LoginComponent},
    { path: 'promenalozinke', component: PromenaLozinkeComponent },

    { path: 'profil', component: ProfilComponent},

    { path: 'dodajvikendicu', component: DodajVikendicuComponent},
    { path: 'mojevikendice', component: MojeVikendiceComponent},
    { path: 'azurirajvikendicu/:id', component: AzurirajVikendicuComponent },
    { path: 'rezervacijevlasnik', component:RezervacijeVlasnikComponent},
    { path: 'rezervacijekalendar', component:RezervacijeKalendarComponent},

    { path: 'vikendice', component: SveVikendiceComponent},
    { path: 'vikendica/:id', component: VikendicaStranicaComponent},
    { path: 'napravirezervaciju', component: NapraviRezervacijuComponent},
    { path: 'rezervacijeturista', component: RezervacijeTuristaComponent},

    { path: 'admin/svizahtevi', component: ZahteviAdminComponent},
    { path: 'admin/svikorisnici', component: KorisniciAdminComponent},
    { path: 'admin/svevikendice', component: VikendiceAdminComponent},
    { path: 'admin/azuriraj/:username', component: AzurirajKorisnikaComponent},
    { path: 'admin/login', component: LoginAdminComponent}


];
