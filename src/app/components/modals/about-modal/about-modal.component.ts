import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-about-modal',
  templateUrl: './about-modal.component.html',
  styleUrls: ['./about-modal.component.scss']
})
export class AboutModalComponent implements OnInit, OnDestroy {

  constructor(public dialogRef: MatDialogRef<AboutModalComponent>) {

  }

  public ngOnInit(): void {
    return;
  }

  public ngOnDestroy(): void {
    return;
  }

  public performCloseAction(): void {
    this.dialogRef.close();
  }

}
