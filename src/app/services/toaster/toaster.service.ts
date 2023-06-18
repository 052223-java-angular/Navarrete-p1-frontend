import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  success!: (message: string) => void;
  error!: (error: { [key: string]: string }) => void;

  constructor() {}

  initSuccess(fn: (message: string) => void) {
    this.success = fn;
  }

  initError(fn: (error: { [key: string]: string }) => void) {
    this.error = fn;
  }
}
