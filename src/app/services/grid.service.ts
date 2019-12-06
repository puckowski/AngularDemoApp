import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoggerService } from './logger.service';
import { AgGridReady } from '@app/models/ag-grid-ready.model';
import { GridApi, ColumnApi, Column } from 'ag-grid-community';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class GridService {

  private readonly INITIAL_GRID_KEY: number = 0;
  private readonly INITIAL_GRID_MAP_VALUE: AgGridReady = null;

  private gridApiMap: Map<number, BehaviorSubject<AgGridReady>>;
  private nextGridKey: number;
  private mainGridKey: number;

  constructor(private loggerService: LoggerService, private toastService: ToastService) {
    this.nextGridKey = this.INITIAL_GRID_KEY;

    this.initGridApiMap();
  }

  private initGridApiMap(): void {
    this.gridApiMap = new Map<number, BehaviorSubject<AgGridReady>>();
  }

  private addGridKeyToMap(newKey: number): void {
    this.gridApiMap.set(newKey, new BehaviorSubject<AgGridReady>(this.INITIAL_GRID_MAP_VALUE));
  }

  private incrementGridKey(): void {
    this.nextGridKey++;
  }

  private getGridKeyAndIncrement(): number {
    const nextGridKey: number = this.nextGridKey;
    this.incrementGridKey();
    this.addGridKeyToMap(nextGridKey);

    return nextGridKey;
  }

  public setMainGridKey(mainGridKey: number): void {
    this.mainGridKey = mainGridKey;
  }

  public getMainGridKey(): number {
    return this.mainGridKey;
  }

  public getNewGridKey(): number {
    return this.getGridKeyAndIncrement();
  }

  public setGridApiByKey(gridApiKey: number, gridReady: AgGridReady): void {
    if (this.hasApiKey(gridApiKey) === true) {
      this.gridApiMap.get(gridApiKey).next(gridReady);
    } else {
      this.loggerService.error('Failed to set grid API. Grid API map does not have key: ' + gridApiKey);
    }
  }

  public hasApiKey(gridApiKey: number): boolean {
    return this.gridApiMap.has(gridApiKey);
  }

  public getApiSubjectByKey(gridApiKey: number): BehaviorSubject<AgGridReady> {
    if (this.hasApiKey(gridApiKey) === true) {
      return this.gridApiMap.get(gridApiKey);
    } else {
      this.loggerService.error('Failed to get grid API subject. Grid API map does not have key: ' + gridApiKey);
    }
  }

  public getApiByKey(gridApiKey: number): GridApi {
    if (this.hasApiKey(gridApiKey) === true) {
      return this.gridApiMap.get(gridApiKey).value.api;
    } else {
      this.loggerService.error('Failed to get grid API. Grid API map does not have key: ' + gridApiKey);
    }
  }

  public getColumnApiByKey(gridApiKey: number): ColumnApi {
    if (this.hasApiKey(gridApiKey) === true) {
      return this.gridApiMap.get(gridApiKey).value.columnApi;
    } else {
      this.loggerService.error('Failed to get grid column API. Grid API map does not have key: ' + gridApiKey);
    }
  }

  public getAllColumnIds(gridApiKey: number): any[] {
    const columnApi: ColumnApi = this.getColumnApiByKey(gridApiKey);
    const allColumnIds: any[] = [];

    columnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.getColId());
    });

    return allColumnIds;
  }

  public columnAutoSizeAll(gridApiKey: number): void {
    const columnApi: ColumnApi = this.getColumnApiByKey(gridApiKey);
    columnApi.autoSizeAllColumns();
    this.toastService.toast('Main grid auto sized.');
  }

  public columnFitAll(gridApiKey: number): void {
    const gridApi: GridApi = this.getApiByKey(gridApiKey);
    gridApi.sizeColumnsToFit();
    this.toastService.toast('Main grid fit to window.');
  }

  public getApiReadyByKey(gridApiKey: number) {
    if (this.hasApiKey(gridApiKey) === true) {
      return this.gridApiMap.get(gridApiKey) !== null;
    } else {
      this.loggerService.error('Failed to determine if grid API was ready. Grid API map does not have key: ' + gridApiKey);
    }
  }
}
