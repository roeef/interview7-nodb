import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {StatsComponent} from '../comp/stats/stats.component';
import {DataComponent} from '../comp/data/data.component';
import {NotFoundComponent} from '../comp/not-found/not-found.component';
import {HomeComponent} from '../comp/home/home.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'data', pathMatch: 'full' },
  { path: 'data', component: DataComponent},
  { path: 'stats', component: StatsComponent},
  { path: '**', component: NotFoundComponent }
];



@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
