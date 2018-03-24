import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import {StudentService} from '../../services/student.service';
import {UiStatesService} from '../../services/ui-states.service';
import {SomeDataSourceModule} from '../../modules/some-data-source/some-data-source.module';
import {SomeDataBaseWrapperModule} from '../../modules/some-data-base-wrapper/some-data-base-wrapper.module';

/**
 * @title Feature-rich data table
 */
@Component({
  selector: 'app-grid',
  styleUrls: ['grid.component.css'],
  templateUrl: 'grid.component.html',
})
export class GridComponent implements OnInit {
  constructor(private student: StudentService, private uiStateService: UiStatesService) {
  }
  displayedColumns = ['studentId', 'firstName', 'lastName', 'grade', 'course', 'date'];
  someDatabase = new SomeDataBaseWrapperModule(this.student);
  get state() {
    return this.uiStateService.grid;
  }
  get selection () {
    return this.state.selection;
  }

  get hasChanged () {
    return this.uiStateService.detailsState.hasCahnged;
  }

  get dataSource() {
    return this.state.dataSource;
  }

  set dataSource( ds : SomeDataSourceModule) {
    this.state.dataSource = ds;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.dataSource = new SomeDataSourceModule(this.someDatabase, this.paginator, this.sort);
    console.log(this.dataSource);
  }
}


