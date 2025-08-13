import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Vikendica } from '../../models/vikendica';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vikendice-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vikendice-admin.component.html',
  styleUrl: './vikendice-admin.component.css'
})
export class VikendiceAdminComponent implements OnInit{

  servis = inject(AdminService)
  vikendice : Vikendica[]

  ngOnInit(): void {
    this.servis.dohvatiSveVikendice().subscribe(
      (data)=>{this.vikendice=data}
    )
  }

  blokiraj(v: Vikendica){
    this.servis.blokirajVikendicu(v.id).subscribe(
      (data)=>{
        if(data==1){
          v.blokirana=1;
        }
      }
    )
  }

}
