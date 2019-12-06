import { Component, OnInit, OnDestroy } from '@angular/core';
import { GridService } from '@app/services/grid.service';
import { SubscriberGeneric } from '@app/helpers/subscriber-generic.helper';
import { GridOptions } from 'ag-grid-community';
import { AgGridReady } from '@app/models/ag-grid-ready.model';
import { LoggerService } from '@app/services/logger.service';
import { BottomSheetService } from '@app/services/bottom-sheet.service';
import { RequestService } from '@services/requests/request.service';
import { PlannedPart } from '@app/models/planned-part.model';
import { DataHelper } from '@app/helpers/data-helper.helper';
import { Location } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends SubscriberGeneric implements OnInit, OnDestroy {

  private readonly CELL_STYLE_MAP_PART_HEALTH: Map<string, string> = new Map([
    [ 'Good', 'rgba(0,255,0,0.5)' ],
    [ 'Review', 'rgba(0,255,0,0.3)' ],
    [ 'Attention', 'rgba(255,255,0,0.5)' ],
    [ 'Poor', 'rgba(255,0,0,0.5)' ]
  ]);

  private gridOptions: GridOptions;
  private gridApiKey: number;
  private rowData: Array<PlannedPart>;
  private defaultColDef: any;
  private defaultColGroupDef: any;
  private columnTypes: any;

  private columnDefs: Array<any> = [
    { headerName: 'Part Number', field: 'partNumber' },
    { headerName: 'Nomenclature', field: 'nomenclature' },
    { headerName: 'MRP Type', field: 'mrpType' },
    { headerName: 'Unit Cost New', field: 'unitCostNew', type: 'costColumn' },
    { headerName: 'Unit Cost Used', field: 'unitCostUsed', type: 'costColumn' },
    { headerName: 'Repairable Indicator', field: 'repairable' },
    { headerName: 'Lead Time (Days)', field: 'leadTime', type: 'numberColumn' },
    { headerName: 'Available Quantity', field: 'availableQuantity', type: 'numberColumn',
      cellStyle: function(params) {
        const backgroundColorString: string = this.getAvailableQuantityCellColor(params.value);

        return { backgroundColor: backgroundColorString };
      }.bind(this)
    },
    { headerName: 'Total Quantity', field: 'totalQuantity', type: 'numberColumn' },
    { headerName: 'Shop Required Quantity', field: 'shopRequiredQuantity', type: 'numberColumn' },
    { headerName: 'Bonded Quantity', field: 'bondedQuantity', type: 'numberColumn' },
    { headerName: 'Forecast Quantity 90 Days', field: 'forecastQuantity90Days', type: 'numberColumn' },
    { headerName: 'Reorder Point', field: 'reorderPoint', type: 'numberColumn' },
    { headerName: 'Supplier Code', field: 'supplierCode' },
    { headerName: 'Supplier Name', field: 'supplierName' },
    { headerName: 'Part Health', field: 'partHealth', 
      cellStyle: function(params) {
        const backgroundColorString: string = this.getPartHealthCellColor(params.value);

        return { backgroundColor: backgroundColorString };
      }.bind(this)
    }
  ];

  constructor(private bottomSheetService: BottomSheetService, private gridService: GridService,
              private loggerService: LoggerService, private requestService: RequestService,
              private location: Location) {
    super();

    this.rowData = new Array<PlannedPart>();
    this.gridOptions = null;
    this.gridApiKey = this.gridService.getNewGridKey();
    this.gridService.setMainGridKey(this.gridApiKey);

    this.defaultColDef = {
      width: 150,
      editable: false,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      suppressColumnVirtualisation: true
    };
    this.defaultColGroupDef = { marryChildren: true };
    this.columnTypes = {
      numberColumn: {
        width: 120,
        filter: 'agNumberColumnFilter'
      },
      costColumn: {
        width: 120,
        filter: 'agNumberColumnFilter',
        valueFormatter: this.cellCurrencyFormatter.bind(this)
      },
      editableColumn: { editable: true },
      dateColumn: {
        filter: 'agDateColumnFilter',
        filterParams: {
          comparator(filterLocalDateAtMidnight, cellValue) {
            const dateParts = cellValue.split('/');
            const day = Number(dateParts[0]);
            // Zero indexed
            const month = Number(dateParts[1]) - 1;
            const year = Number(dateParts[2]);
            const cellDate = new Date(year, month, day);
            if (cellDate < filterLocalDateAtMidnight) {
              return -1;
            } else if (cellDate > filterLocalDateAtMidnight) {
              return 1;
            } else {
              return 0;
            }
          }
        }
      }
    };
  }

  public ngOnInit(): void {
    this.pushAutoUnsubscribeArray([
      this.gridService.getApiSubjectByKey(this.gridApiKey).subscribe((gridOptions: GridOptions) => {
        if (gridOptions === null || gridOptions === undefined) {
          return;
        }
      }),

      this.requestService.getMockMainGridData().subscribe((plannedParts: Array<PlannedPart>) => {
        this.rowData = plannedParts;

        this.navigateRouteIfNeeded(plannedParts);
      })
    ]);
  }

  public getColumnDefs(): Array<any> {
    return this.columnDefs;
  }

  public getRowData(): Array<PlannedPart> {
    return this.rowData;
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public getDefaultColGroupDef(): object {
    return this.defaultColGroupDef;
  }

  public getDefaultColDef(): object {
    return this.defaultColDef;
  }

  public getColTypes(): object {
    return this.columnTypes;
  }

  private navigateRouteIfNeeded(plannedParts: PlannedPart[]): void {
    const currentPathWithoutHash: string = this.location.path(false);
    const currentUrlSegmentStrings: string[] = currentPathWithoutHash.split('/');
    currentUrlSegmentStrings.splice(0, 1);

    if (currentUrlSegmentStrings.length > 0) {
      plannedParts.forEach((plannedPart: PlannedPart) => {
        if (plannedPart.partNumber === currentUrlSegmentStrings[1]) {
          this.bottomSheetService.setSelectedRowNode(plannedPart);
        }
      });
    }
  }

  public onGridReady(gridReady: AgGridReady): void {
    this.gridService.setGridApiByKey(this.gridApiKey, gridReady);

    this.gridOptions = {
      context: {
        parentComponent: this
      }
    };
  }

  public onRowClicked(): void {
    if (this.gridService.getApiReadyByKey(this.gridApiKey) === true) {
      const selectedRows: PlannedPart[] = this.gridService.getApiByKey(this.gridApiKey).getSelectedRows();
      this.bottomSheetService.setSelectedRowNode(selectedRows[0]);
    } else {
      this.loggerService.log('Grid API for key not ready yet: ' + this.gridApiKey);
    }
  }

  private getPartHealthCellColor(partHealthString: string): string {
    if (this.CELL_STYLE_MAP_PART_HEALTH.has(partHealthString) === true) {
      return this.CELL_STYLE_MAP_PART_HEALTH.get(partHealthString);
    } else {
      return 'rgba(255,255,255,0)';
    }
  }

  private getAvailableQuantityCellColor(partAvailableQuantity: number): string {
    if (partAvailableQuantity < 0) {
      return 'rgba(255,0,0,0.5)';
    } else if (partAvailableQuantity > 0) {
      return 'rgba(0,255,0,0.5)';
    } else {
      return 'rgba(255,255,0,0.5)';
    }
  }

  public cellCurrencyFormatter(params): string {
    return DataHelper.formatNumberToCost(params.value);
  }

  public applyQuickFilter(quickFilterString: string): void {
    if (this.gridService.getApiReadyByKey(this.gridApiKey) === true) {
      this.gridService.getApiByKey(this.gridApiKey).setQuickFilter(quickFilterString);
    } else {
      this.loggerService.log('Grid API for key not ready yet: ' + this.gridApiKey);
    }
  }
}
