import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  public readonly DEFAULT_ACTION_STRING: string = 'DISMISS';
  public readonly DEFAULT_DURATION_SHORT: number = 2500;
  public readonly DEFAULT_DURATION_LONG: number = 5000;

  constructor(private snackBar: MatSnackBar) { }

  public toast(message: string, action: string = this.DEFAULT_ACTION_STRING, toastDuration: number = this.DEFAULT_DURATION_SHORT): void {
    this.snackBar.open(message, action, {
      duration: toastDuration,
      panelClass: ['snackbar-custom']
    });
  }
}
