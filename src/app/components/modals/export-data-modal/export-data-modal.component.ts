import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GridService } from '@app/services/grid.service';
import { ColumnModalData } from '../column-modal-data.model';
import { GridApi } from 'ag-grid-community';
import { LoggerService } from '@app/services/logger.service';
import { DataHelper } from '@app/helpers/data-helper.helper';

@Component({
  selector: 'app-export-data-modal',
  templateUrl: './export-data-modal.component.html',
  styleUrls: ['./export-data-modal.component.scss']
})
export class ExportDataModalComponent implements OnInit, OnDestroy {

  private readonly DEFAULT_OPTION_ALL_COLUMNS: boolean = true;

  public optionSkipHeader: boolean;
  public optionSuppressQuotes: boolean;
  public optionAllColumns: boolean;
  public exportFilename: string;

  constructor(public dialogRef: MatDialogRef<ExportDataModalComponent>,
              @Inject(MAT_DIALOG_DATA) private data: ColumnModalData, private gridService: GridService,
              private loggerService: LoggerService) {
    this.optionAllColumns = this.DEFAULT_OPTION_ALL_COLUMNS;
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

  private getExportFilename(): string {
    let currentDateString: string = new Date().toLocaleDateString();
    currentDateString = currentDateString.replace(new RegExp(' ', 'g'), '_');

    return 'Demo_App_' + currentDateString + '_Export';
  }

  public performExportDataAction(): void {
    this.exportFilename = this.getExportFilename();

    const exportParams = {
      optionSkipHeader: this.optionSkipHeader,
      optionAllColumns: this.optionAllColumns,
      optionSuppressQuotes: this.optionSuppressQuotes,
      fileName: this.exportFilename
    };

    const gridApi: GridApi = this.gridService.getApiByKey(this.data.getApiKey());

    if (DataHelper.isDefined(gridApi) === false) {
      this.loggerService.error('Main grid API not yet ready. Could not export data.');

      return;
    }

    gridApi.exportDataAsCsv(exportParams);
  }

}
