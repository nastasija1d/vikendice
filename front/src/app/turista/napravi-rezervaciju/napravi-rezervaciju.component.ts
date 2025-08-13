import { Component, inject } from '@angular/core';
import { Rezervacija } from '../../models/rezervacija';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RezervacijaService } from '../../services/rezervacija.service';
import { Korisnik } from '../../models/korisnik';

@Component({
  selector: 'app-napravi-rezervaciju',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './napravi-rezervaciju.component.html',
  styleUrl: './napravi-rezervaciju.component.css'
})
export class NapraviRezervacijuComponent {

  rezervacija: Rezervacija;
  brojNocenja: number = 0;
  servis = inject(RezervacijaService)
  ruter = inject(Router)
  korisnik:Korisnik
  cenaPoNocenju:number

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.rezervacija = navigation?.extras?.state?.['rezervacija'];
  }

  ngOnInit(): void {
    this.rezervacija.cena = this.izracunajCenu() 
    this.proveriKarticu()
     const ulogovani = localStorage.getItem("ulogovaniKorisnik");
    if (ulogovani) {
      this.korisnik = JSON.parse(ulogovani);
    }
  }

  posaljiRezervaciju(): void {
    console.log(this.rezervacija)
    this.servis.kreirajRezervaciju(this.rezervacija).subscribe(
      (data)=>{
        if (data==0){
          alert("Vikendica je zauzeta u datom periodu!")
          this.ruter.navigate(['/vikendica',this.rezervacija.vikendica.id])
        }else{
          alert("Rezervacija poslata!")
          this.ruter.navigate(['vikendice'])
        }
      }
    )
  }

  izracunajCenu(): number {
    const datumOD = new Date(this.rezervacija.datumOD);
    const datumDO = new Date(this.rezervacija.datumDO);

    datumOD.setHours(0, 0, 0, 0);
    datumDO.setHours(0, 0, 0, 0);

    const diffMs = datumDO.getTime() - datumOD.getTime();
    const brojNocenja = diffMs / (1000 * 60 * 60 * 24);
    if (brojNocenja <= 0) return 0;
    this.brojNocenja = brojNocenja

    const letnjiMeseci = [4, 5, 6, 7]; // maj (4) do avgust (7)
    const mesecRezervacije = datumOD.getMonth();

    this.cenaPoNocenju = letnjiMeseci.includes(mesecRezervacije)
      ? this.rezervacija.vikendica.cenaLeto
      : this.rezervacija.vikendica.cenaZima;

    const brojOsoba = Number(this.rezervacija.odrasli) + Number(this.rezervacija.deca)*0.5

    console.log("DECA: " + this.rezervacija.deca + "  ODRASLI: "+ this.rezervacija.odrasli)
    console.log("Noci: " + brojNocenja +". Osobe: " + brojOsoba + " CenaPoNoci: " + this.cenaPoNocenju)

    return Math.round(brojNocenja * brojOsoba * this.cenaPoNocenju);
  }

  formatDatumCustom(datumStr: string): string {
    const date = new Date(datumStr);

    const dani = ['Ned', 'Pon', 'Uto', 'Sre', 'Cet', 'Pet', 'Sub'];
    const meseci = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dan = dani[date.getDay()];
    const datum = date.getDate();
    const mesec = meseci[date.getMonth()];
    const godina = date.getFullYear();

    return `${dan}, ${datum} ${mesec} ${godina}`;
  }

  formatirajDatum(d: Date): string {
    const datum = new Date(d);
    const god = datum.getFullYear();
    const mesec = ('0' + (datum.getMonth() + 1)).slice(-2);
    const dan = ('0' + datum.getDate()).slice(-2);
    return `${god}-${mesec}-${dan}`;
  }

  karticaValidna: boolean = false;
  porukaKartica: string = '';
  tipKartice: string | null = null;

  proveriKarticu() {
    const broj = this.rezervacija.kartica;
    this.tipKartice = null;
    this.karticaValidna = false;
    if (!broj) {
      this.porukaKartica = 'Broj kartice je obavezan.';
      return;
    }
    if (/^3(00|01|02|03|6[0-9]|8[0-9])\d{12}$/.test(broj)) {
      this.tipKartice = 'dina';
      this.karticaValidna = true;
    } else if (/^5[1-5]\d{14}$/.test(broj)) {
      this.tipKartice = 'master';
      this.karticaValidna = true;
    } else if (/^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/.test(broj)) {
      this.tipKartice = 'visa';
      this.karticaValidna = true;
    } else {
      this.porukaKartica = 'Unesite validan broj kartice (Visa, MasterCard, Diners).';
      this.karticaValidna = false;
      return;
    }
    this.porukaKartica = '';
  }

}
