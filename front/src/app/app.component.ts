import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegistracijaComponent } from "./opste/registracija/registracija.component";
import { LoginComponent } from "./opste/login/login.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front';
}
