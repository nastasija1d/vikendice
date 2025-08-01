import { Routes } from '@angular/router';
import { RegistracijaComponent } from './opste/registracija/registracija.component';
import { LoginComponent } from './opste/login/login.component';
import { PromenaLozinkeComponent } from './opste/promena-lozinke/promena-lozinke.component';
import { ProfilComponent } from './opste/profil/profil.component';
import { DodajVikendicuComponent } from './vlasnik/dodaj-vikendicu/dodaj-vikendicu.component';
import { AzurirajVikendicuComponent } from './vlasnik/azuriraj-vikendicu/azuriraj-vikendicu.component';

export const routes: Routes = [
    { path: 'registracija', component: RegistracijaComponent },
    { path: 'login', component: LoginComponent},
    { path: 'promenalozinke', component: PromenaLozinkeComponent },
    { path: 'profil', component: ProfilComponent},
    { path: 'dodajvikendicu', component: DodajVikendicuComponent},
    { path: 'azurirajvikendicu/:id', component: AzurirajVikendicuComponent }

];
