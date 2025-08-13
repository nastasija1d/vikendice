import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VikendicaService } from '../../services/vikendica.service';
import { Vikendica } from '../../models/vikendica';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VikendicaKarticaComponent } from "../vikendica-kartica/vikendica-kartica.component";

@Component({
  selector: 'app-sve-vikendice',
  standalone: true,
  imports: [CommonModule, FormsModule, VikendicaKarticaComponent],
  templateUrl: './sve-vikendice.component.html',
  styleUrl: './sve-vikendice.component.css'
})
export class SveVikendiceComponent {
  vikendice: Vikendica[] = [];
  searchTerm: string = '';

  // Kombinovani parametar
  sortOption: string = 'naziv/asc';

  route = inject(ActivatedRoute);
  router = inject(Router);
  servis = inject(VikendicaService);

  ngOnInit(): void {
    const query = this.route.snapshot.queryParamMap.get('search');
    if (query) {
      this.searchTerm = query;
    }
    this.loadVikendice();
  }

  search(): void {
    this.router.navigate([], {
      queryParams: { search: this.searchTerm || null }
    });
    this.loadVikendice();
  }

  loadVikendice(): void {
    this.servis.dohvatiSveVikendice(this.searchTerm).subscribe(data => {
      this.vikendice = data;
      this.sortVikendice();
    });
  }

  sortVikendice(): void {
    const [param, order] = this.sortOption.split('/') as ['naziv' | 'mesto' | 'cenaLeto', 'asc' | 'desc'];

    this.vikendice.sort((a, b) => {
      let valA = a[param];
      let valB = b[param];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB as string).toLowerCase();
      }

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
