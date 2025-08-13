export class Korisnik {
  username: string;
  lozinka: string;
  email: string;
  ime: string;
  prezime: string;
  pol: number; // 0 for M, 1 for F
  adresa: string;
  telefon: string;
  kartica: string;
  tip: number; // 0: vlasnik, 1: turista, 2: admin
  slika?: string; 
  status: number;

  constructor(
    username: string = '',
    lozinka: string = '',
    email: string = '',
    ime: string = '',
    prezime: string = '',
    pol: number = 0,
    adresa: string = '',
    telefon: string = '',
    kartica: string = '',
    tip: number = 1,
    slika?: string
  ) {
    this.username = username;
    this.lozinka = lozinka;
    this.email = email;
    this.ime = ime;
    this.prezime = prezime;
    this.pol = pol;
    this.adresa = adresa;
    this.telefon = telefon;
    this.kartica = kartica;
    this.tip = tip;
    this.slika = slika;
  }
}
