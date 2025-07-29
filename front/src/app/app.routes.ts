import { Routes } from '@angular/router';
import { RegistracijaComponent } from './opste/registracija/registracija.component';
import { LoginComponent } from './opste/login/login.component';
import { PromenaLozinkeComponent } from './opste/promena-lozinke/promena-lozinke.component';

export const routes: Routes = [
    { path: 'registracija', component: RegistracijaComponent },
    { path: 'login', component: LoginComponent},
    { path: 'promenaLozinke', component: PromenaLozinkeComponent }
];
