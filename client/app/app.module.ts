import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environments/environment';


import {A11yModule} from '@angular/cdk/a11y';
import {BidiModule} from '@angular/cdk/bidi';
import {ObserversModule} from '@angular/cdk/observers';
import {OverlayModule} from '@angular/cdk/overlay';
import {PlatformModule} from '@angular/cdk/platform';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatPaginatorModule,
  MatSortModule, MatFormFieldModule, MatDividerModule
} from '@angular/material';
import {GridComponent} from './comp/grid/grid.component';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './comp/home/home.component';
import {NotFoundComponent} from './comp/not-found/not-found.component';
import {DetailsPanelComponent} from './comp/details-panel/details-panel.component';
import {FilterComponent} from './comp/filter/filter.component';
import {DataComponent} from './comp/data/data.component';
import {StatsComponent} from './comp/stats/stats.component';
import {ChartByTimeComponent} from './comp/chart-by-time/chart-by-time.component';
import {ChartByCourseComponent} from './comp/chart-by-course/chart-by-course.component';
import {AppService} from './services/app.service';
import {UiStatesService} from './services/ui-states.service';
import {StudentService} from './services/student.service';

/**
 * NgModule that includes all Material modules that are required to serve
 * the Plunker.
 */
@NgModule({
  exports: [
    // CDK
    A11yModule,
    BidiModule,
    ObserversModule,
    OverlayModule,
    PlatformModule,
    PortalModule,
    ScrollDispatchModule,
    CdkStepperModule,
    CdkTableModule,

    // Material
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSortModule
  ]
})
export class MaterialModule {}


@NgModule({

  declarations: [
    GridComponent,
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    DetailsPanelComponent,
    GridComponent,
    FilterComponent,
    DataComponent,
    StatsComponent,
    ChartByTimeComponent,
    ChartByCourseComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    MatDatepickerModule, MatNativeDateModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [
    AppService,
    StudentService,
    UiStatesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
