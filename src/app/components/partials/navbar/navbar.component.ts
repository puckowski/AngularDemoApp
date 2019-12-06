import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ColumnModalComponent } from '@modals/column-modal/column-modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ColumnModalData } from '@app/components/modals/column-modal-data.model';
import { GridService } from '@app/services/grid.service';
import { AuthenticationService } from '@app/services/authentication.service';
import { RoutingService } from '@app/services/routing.service';
import { MatSidenav } from '@angular/material';
import { environment } from '@environments/environment';
import { AboutModalComponent } from '@modals/about-modal/about-modal.component';
import { ExportDataModalComponent } from '@modals/export-data-modal/export-data-modal.component';
import { BottomSheetService } from '@app/services/bottom-sheet.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  private readonly MODAL_ID_COLUMN: string = 'Column';
  private readonly MODAL_ID_ABOUT: string = 'About';
  private readonly MODAL_ID_EXPORT: string = 'Export';

  private currentDate: Date;
  private versionTooltipPosition: FormControl;
  @ViewChild('sidenav', { static: false })
  private sidenav: MatSidenav;

  constructor(private dialog: MatDialog, private gridService: GridService,
              private authenticationService: AuthenticationService, private routingService: RoutingService,
              private bottomSheetService: BottomSheetService) {
    this.currentDate = new Date();
    this.versionTooltipPosition = new FormControl('after');
  }

  public ngOnDestroy(): void {
    return;
  }

  public ngOnInit(): void {
    return;
  }

  public getAppVersionString(): string {
    return environment.appVersionString;
  }

  public getVersionTooltipPosition(): FormControl {
    return this.versionTooltipPosition;
  }

  public isAuthenticated(): boolean {
    return this.authenticationService.currentUserValue !== null;
  }

  public getDateString(): string {
    return this.currentDate.toDateString();
  }

  public openModal(modalIdentifier: string): void {
    let dialogRef;
    let dialogConfig: MatDialogConfig = new MatDialogConfig();

    dialogConfig = {
      maxHeight: '100vh',
    };

    switch (modalIdentifier) {
      case this.MODAL_ID_COLUMN: {
        dialogConfig.data = new ColumnModalData(this.gridService.getMainGridKey());
        dialogRef = this.dialog.open(ColumnModalComponent, dialogConfig);

        break;
      }
      case this.MODAL_ID_ABOUT: {
        dialogRef = this.dialog.open(AboutModalComponent, dialogConfig);

        break;
      }
      case this.MODAL_ID_EXPORT: {
        dialogConfig.data = new ColumnModalData(this.gridService.getMainGridKey());
        dialogRef = this.dialog.open(ExportDataModalComponent, dialogConfig);

        break;
      }
      default: {

        break;
      }
    }

    dialogRef.afterClosed().subscribe((result: any) => {
      return;
    });
  }

  public toggleSidenav(): void {
    this.sidenav.toggle();
  }

  public isSidenavReady(): boolean {
    return this.sidenav !== null && this.sidenav !== undefined;
  }

  public getSidenavOpen(): boolean {
    if (this.isSidenavReady() === false) {
      return false;
    }

    return this.sidenav.opened;
  }

  public performLogoutAction(): void {
    this.toggleSidenav();
    this.bottomSheetService.setBottomSheetState(this.bottomSheetService.BOTTOM_SHEET_STATE_DEFAULT);
    this.bottomSheetService.clearSelectedRowNode();
    this.authenticationService.logout();
    this.routingService.navigateLogin();
  }
}
