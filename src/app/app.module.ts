import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/partials/navbar/navbar.component';
import { AgGridModule } from 'ag-grid-angular';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MatInputModule } from '@angular/material';
import { MatDialogModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error-default.interceptor';
import { FakeBackendProvider } from './interceptors/backend-test.interceptor';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { BottomSheetComponent } from './components/partials/bottom-sheet/bottom-sheet.component';
import { MatTabsModule } from '@angular/material/tabs';
import { GridSearchbarComponent } from './components/partials/grid-searchbar/grid-searchbar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FloatingActionButtonComponent } from './components/partials/floating-action-button/floating-action-button.component';
import { PartInfoComponent } from './components/partials/bottom-sheet/tabs/part-info/part-info.component';
import { ForecastSupplyComponent } from './components/partials/bottom-sheet/tabs/forecast-supply/forecast-supply.component';
import { MrpDataComponent } from './components/partials/bottom-sheet/tabs/mrp-data/mrp-data.component';
import { MatRippleModule } from '@angular/material/core';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { PlotlyViaWindowModule } from 'angular-plotly.js';
import { ColumnModalComponent } from './components/modals/column-modal/column-modal.component';
import { NotesComponent } from './components/partials/bottom-sheet/tabs/notes/notes.component';
import { AboutModalComponent } from './components/modals/about-modal/about-modal.component';
import { ExportDataModalComponent } from './components/modals/export-data-modal/export-data-modal.component';
import { PostNoteComponent } from './components/partials/bottom-sheet/tabs/notes/post-note/post-note.component';

@NgModule({
  entryComponents: [
    ColumnModalComponent,
    AboutModalComponent,
    ExportDataModalComponent
  ],
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    BottomSheetComponent,
    GridSearchbarComponent,
    FloatingActionButtonComponent,
    PartInfoComponent,
    ForecastSupplyComponent,
    MrpDataComponent,
    ColumnModalComponent,
    NotesComponent,
    AboutModalComponent,
    ExportDataModalComponent,
    PostNoteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    AgGridModule.withComponents([]),
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatTabsModule,
    MatTooltipModule,
    CommonModule,
    PlotlyViaWindowModule,
    MatRippleModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    FakeBackendProvider,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
