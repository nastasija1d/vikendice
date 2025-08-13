import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  currentYear!: number;
  currentMonth!: number; // 0 = Jan, 11 = Dec
  weeks: (number | null)[][] = [];

  today = new Date();
  todayYear = this.today.getFullYear();
  todayMonth = this.today.getMonth();
  todayDate = this.today.getDate();

  datumOD: Date | null = null;
  datumDO: Date | null = null;

  @Output() datumiChange = new EventEmitter<{ datumOD: string , datumDO: string  }>();

  weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  ngOnInit() {
    this.currentYear = this.todayYear;
    this.currentMonth = this.todayMonth;
    this.datumOD = new Date(this.todayYear, this.todayMonth, this.todayDate);
    this.datumDO = null;
    this.emitDatumi();
    this.generateCalendar();
  }

  private generateCalendar() {
    this.weeks = [];
    const firstOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const shift = (firstOfMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    let week: (number | null)[] = new Array(7).fill(null);
    let dayCounter = 1;

    // fill first week
    for (let i = shift; i < 7; i++) {
      week[i] = dayCounter++;
    }
    this.weeks.push(week);

    // fill remaining weeks
    while (dayCounter <= daysInMonth) {
      week = new Array(7).fill(null);
      for (let i = 0; i < 7 && dayCounter <= daysInMonth; i++) {
        week[i] = dayCounter++;
      }
      this.weeks.push(week);
    }
  }

  prevMonth() {
    // Don't allow going to previous months if current month is today's month
    if (this.currentYear === this.todayYear && this.currentMonth === this.todayMonth) {
      return;
    }

    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  selectDay(day: number | null) {
    if (day === null) return;
    
    const clicked = new Date(this.currentYear, this.currentMonth, day);
    const today = new Date(this.todayYear, this.todayMonth, this.todayDate);
    
    // Don't allow selecting past dates
    if (clicked < today) return;

    // if no start yet, or both already set → start fresh
    if (!this.datumOD || (this.datumOD && this.datumDO)) {
      this.datumOD = clicked;
      this.datumDO = null;
      this.emitDatumi();
      return;
    }

    // only start is set → set end
    if (this.datumOD && !this.datumDO) {
      if (clicked < this.datumOD) {
        this.datumDO = this.datumOD;
        this.datumOD = clicked;
      } else {
        this.datumDO = clicked;
      }
      this.emitDatumi();
    }
  }

  private emitDatumi() {
    const datumODstr = this.datumOD ? this.toYYYYMMDD(this.datumOD) : null;
    const datumDOstr = this.datumDO ? this.toYYYYMMDD(this.datumDO) : datumODstr;

    this.datumiChange.emit({
      datumOD: datumODstr,
      datumDO: datumDOstr
    });
  }
  
  private toYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  isInRange(day: number | null): boolean {
    if (!this.datumOD || !this.datumDO || day === null) return false;
    const d = new Date(this.currentYear, this.currentMonth, day);
    return d >= this.datumOD! && d <= this.datumDO!;
  }

  isStart(day: number | null): boolean {
    if (!this.datumOD || day === null) return false;
    return this.datumOD.getDate() === day
        && this.datumOD.getMonth() === this.currentMonth
        && this.datumOD.getFullYear() === this.currentYear;
  }
  
  isEnd(day: number | null): boolean {
    if (!this.datumDO || day === null) return false;
    return this.datumDO.getDate() === day
        && this.datumDO.getMonth() === this.currentMonth
        && this.datumDO.getFullYear() === this.currentYear;
  }

  // Helper method to check if a day is in the past and should be disabled
  isPastDay(day: number | null): boolean {
    if (day === null) return false;
    
    // If month/year is in past, all days are disabled
    if (this.currentYear < this.todayYear) return true;
    if (this.currentYear === this.todayYear && this.currentMonth < this.todayMonth) return true;
    
    // If current month is today's month, disable days before today
    if (this.currentYear === this.todayYear && this.currentMonth === this.todayMonth) {
      return day < this.todayDate;
    }
    
    return false;
  }

  
}