import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { RezervacijaService } from '../../services/rezervacija.service';
import { CalendarOptions } from '@fullcalendar/core';
import { Rezervacija } from '../../models/rezervacija';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rezervacije-kalendar',
  standalone: true,
  imports: [FullCalendarModule, CommonModule, FormsModule],
  templateUrl: './rezervacije-kalendar.component.html',
  styleUrl: './rezervacije-kalendar.component.css'
})
export class RezervacijeKalendarComponent implements OnInit {
  
  rezervacije: Rezervacija[] = [];
  calendarOptions: CalendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      events: [],
      eventClick: this.onEventClick.bind(this), // klik na event
    };

  constructor(private servis: RezervacijaService) {}

  ngOnInit(): void {
    const kor = localStorage.getItem('ulogovaniKorisnik');
    if (!kor) return;

    const korisnik = JSON.parse(kor);

    this.servis.dohvatiAktivneVlasnik(korisnik.username).subscribe((data: Rezervacija[]) => {
      this.rezervacije =  data.filter(r => r.status === 0 || r.status === 3 || r.status === 4)
      this.loadEvents();
    });
  }

  loadEvents() {
    const events = this.rezervacije.map(r => {
      let color = '';
      if (r.status === 0) {
        color = ' #a0892c'; // žuta
      } else if (r.status === 3 || r.status === 4) {
        color = '#3f6d6dff'; // zelena
      } else{
        color = '#4b1e2f'
      }

      return {
        title: `${r.vikendica.naziv} - ${r.turista}`,
        id: `${r.id}`,
        start: r.datumOD,
        end: this.addOneDay(r.datumDO), // FullCalendar end date is exclusive
        color: color
      };
    });

    this.calendarOptions.events = events;
  }

  addOneDay(dateStr: string): string {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }

  modalVidljiv: boolean = false;
  odabranaRezervacijaId: number 
  komentarOdbijanje: string = '';
  naslov: string
  period : string
  obavezanKomentar: boolean = false;
  od: string
  do: string
  potvrdjena : boolean = false

  onEventClick(info: any) {
    this.odabranaRezervacijaId = info.event.id
    this.naslov = info.event.title
    this.period = this.formatDate(info.event.start) + " - " + this.formatDate(info.event.end)
    this.modalVidljiv =true;
    this.obavezanKomentar = false
    this.komentarOdbijanje = ''
    this.od = this.toYYYYMMDD(info.event.start)
    this.do = this.toYYYYMMDD(info.event.end)
    this.potvrdjena = info.event.color == '#3f6d6dff'
    for(let r of this.rezervacije){
      if(r.id==this.odabranaRezervacijaId){
        if(r.status>=3){this.potvrdjena = true}
      }
    }
  }

  prihvati() {
    let id = new Rezervacija
    for(let r of this.rezervacije){
      if(r.id==this.odabranaRezervacijaId){
        id = r
      }
    }
    console.log(id)
      this.servis.potvrdiRezervaciju(id).subscribe(
        (data)=>{
          if (data>0){
                id.status = 3;
                this.loadEvents()
                this.zatvoriModal()
          }else{
            alert("Vec postoji rezervacija u dato vreme za datu vikendicu!")
          }
        }
      )
    }

  zatvoriModal(): void {
    this.modalVidljiv = false;
    this.komentarOdbijanje = '';
    this.odabranaRezervacijaId = -1;
  }

  potvrdiOdbijanje(): void {
    if (!this.komentarOdbijanje.trim()) {
      this.obavezanKomentar = true;
      return;
    }
    this.servis.odbijRezervaciju(this.odabranaRezervacijaId, this.komentarOdbijanje).subscribe(
      (data)=>{
        if(data>0){
                for(let r of this.rezervacije){
                  if(r.id==this.odabranaRezervacijaId){
                    r.status = 2
                  }
                }
                this.loadEvents()
          this.zatvoriModal()
        }
      }
    )

  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}.${month}.${year}`;
  }

  private toYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}