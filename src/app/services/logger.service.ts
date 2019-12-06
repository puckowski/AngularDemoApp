import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  private isDevMode: boolean;

  constructor() {
    this.isDevMode = isDevMode();
  }

  public log(message: string): void {
    if (this.isDevMode === true) {
      console.log(message);
    }
  }

  public error(errorMessage: string): void {
    if (this.isDevMode === true) {
      console.error(errorMessage);
    }
  }
}
