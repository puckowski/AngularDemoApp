import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoutingService } from './services/routing.service';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/login/login.component';
import { AuthGuard } from './guard/auth-default.guard';
import { PartInfoComponent } from './components/partials/bottom-sheet/tabs/part-info/part-info.component';
import { ForecastSupplyComponent } from './components/partials/bottom-sheet/tabs/forecast-supply/forecast-supply.component';
import { MrpDataComponent } from './components/partials/bottom-sheet/tabs/mrp-data/mrp-data.component';
import { NotesComponent } from './components/partials/bottom-sheet/tabs/notes/notes.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard],
    children: [
      { path: 'partinfo/:id', component: PartInfoComponent },
      { path: 'forecastsupply/:id', component: ForecastSupplyComponent },
      { path: 'mrpdata/:id', component: MrpDataComponent },
      { path: 'notes/:id', component: NotesComponent }
    ]
  },
  { path: 'login', component: LoginComponent },

  /*
   * Default case.
   */
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  constructor(private routingService: RoutingService) {

  }
}
