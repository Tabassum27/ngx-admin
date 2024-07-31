import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private dataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }

  // Method to set data
  setData(data: any): void {
    this.dataSubject.next(data);
  }

  // Method to get data as observable
  getData(): Observable<any> {
    return this.dataSubject.asObservable();
  }
}
