import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ColumnModalData } from '../column-modal-data.model';
import { GridService } from '@app/services/grid.service';

@Component({
  selector: 'app-column-modal',
  templateUrl: './column-modal.component.html',
  styleUrls: ['./column-modal.component.scss']
})
export class ColumnModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ColumnModalComponent>,
              @Inject(MAT_DIALOG_DATA) private data: ColumnModalData, private gridService: GridService) {

  }

  public ngOnInit(): void {
    return;
  }

  public performCloseAction(): void {
    this.dialogRef.close();
  }

  public performAutoSizeAction(): void {
    this.gridService.columnAutoSizeAll(this.data.getApiKey());
    this.performCloseAction();
  }

  public performFitAction(): void {
    this.gridService.columnFitAll(this.data.getApiKey());
    this.performCloseAction();
  }
}
