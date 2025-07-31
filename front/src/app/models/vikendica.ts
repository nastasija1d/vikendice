export class Vikendica {
  naziv: string = '';
  mesto: string = '';
  telefon: string = '';
  opis: string = '';
  cena_leto: number | null = null;
  cena_zima: number | null = null;
  x: number | null = null;
  y: number | null = null;
  vlasnik: string = '';
  slike: string[] = [];

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
    slike: string[] = []
  ) {
    this.naziv = naziv;
    this.mesto = mesto;
    this.telefon = telefon;
    this.opis = opis;
    this.cena_leto = cena_leto;
    this.cena_zima = cena_zima;
    this.x = x;
    this.y = y;
    this.vlasnik = vlasnik;
    this.slike = slike;
  }
  
  // Metoda za dodavanje slike
  dodajSliku(slika: string): void {
    this.slike.push(slika);
  }
}
