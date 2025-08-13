import { Korisnik } from "./korisnik";
import { Vikendica } from "./vikendica";

export class Rezervacija {
  id: number;
  turista: string;
  turistaKlasa: Korisnik;
  vikendica: Vikendica;
  datumOD: string; // format: "yyyy-MM-dd"
  datumDO: string; // format: "yyyy-MM-dd"
  odrasli: number;
  deca: number;
  cena: number;
  kartica: string;
  status: number; 
  komentarTurista: string;
  komentarVlasnik: string;
  datumKreiranja: string ;
  ocena: number;
  ocenaText: string;

}

