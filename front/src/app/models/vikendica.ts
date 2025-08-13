export class Vikendica {
  naziv: string = '';
  mesto: string = '';
  telefon: string = '';
  opis: string = '';
  cenaLeto: number | null = null;
  cenaZima: number | null = null;
  x: number | null = null;
  y: number | null = null;
  vlasnik: string = '';
  slike: string[] = [];
  id: number | null = null;
  ocena: number;
  blokirana: number;

  constructor(
    naziv: string = '',
    mesto: string = '',
    telefon: string = '',
    opis: string = '',
    cena_leto: number | null = null,
    cena_zima: number | null = null,
    x: number | null = null,
    y: number | null = null,
    vlasnik: string = '',
    slike: string[] = [],
    id: number | null = null
  ) {
    this.naziv = naziv;
    this.mesto = mesto;
    this.telefon = telefon;
    this.opis = opis;
    this.cenaLeto = cena_leto;
    this.cenaZima = cena_zima;
    this.x = x;
    this.y = y;
    this.vlasnik = vlasnik;
    this.slike = slike;
    this.id = id;
  }
  
  // Metoda za dodavanje slike
  dodajSliku(slika: string): void {
    this.slike.push(slika);
  }
}
