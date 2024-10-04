// crud.service.ts
import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  private storageKey = 'events'; // Clave para localStorage

  constructor() {}

  // Obtener eventos desde localStorage
  getEvents(): CalendarEvent[] {
    const events = localStorage.getItem(this.storageKey);
    return events ? JSON.parse(events) : []; // Retorna un arreglo vacío si no hay eventos
  }

  // Agregar un nuevo evento a localStorage
  addEvent(event: CalendarEvent): void {
    const events = this.getEvents();
    events.push(event);
    localStorage.setItem(this.storageKey, JSON.stringify(events)); // Guarda el arreglo actualizado
  }

  // Eliminar un evento de localStorage
  deleteEvent(eventToDelete: CalendarEvent): void {
    const events = this.getEvents().filter(event => event !== eventToDelete);
    localStorage.setItem(this.storageKey, JSON.stringify(events)); // Guarda el arreglo actualizado
  }
}
