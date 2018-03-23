import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataSource} from '@angular/cdk/table';
import {MatPaginator, MatSort} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import Grade from '../../../models/grade';
import Student from '../../../models/student';
import {StudentService} from '../../services/student.service';
import {UiStatesService} from '../../services/ui-states.service';

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
  exampleDatabase = new ExampleDatabase(this.student);
  // selection = new SelectionModel<Grade>(false, []);
  get selection () {
    return this.uiStateService.grid.selection;
  }

  get hasChanged () {
    return this.uiStateService.detailsState.hasCahnged;
  }

  dataSource: ExampleDataSource | null;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    // Observable for the filter
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }


  deletedSelected() {
    // Easly supports multi-select (just enable multi select on selection decleration loop on all selected array
    console.log('clicked id:' + this.selection.selected[0]);
    this.student.remove(this.selection.selected[0].id).then(() => {this.selection.clear(); console.log('deleted!'); });
  }

  addGrade() {
    this.uiStateService.addGrade();
  }

  save() {
    this.uiStateService.saveGrade();
  }

  discard() {
    this.uiStateService.discard();
  }
}

/** Constants used to Generate mocks for test to fill up our data base. */
const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];


/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>([]);
  get data(): Object[] { return this.dataChange.value; }

  constructor(private studentService: StudentService) {
    this.studentService.getStudents().subscribe((student) => {
      this.dataChange.next(student);
    });
    // For generating Mocks for dev test usage you run a few:
    // for (let i = 0; i < 100; i++) { this.addUser(); }
    this.addUser();
    this.addUser();
    this.addUser();
  }

  /** For dev\tests only Adds a new mock user user to the database. */
  addUser() {
    this.studentService.addGrade(this.createNewGrade());
  }

  /** Builds and returns a new Grade. */
  private createNewGrade() {
    const name =
      NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';
    const student = new Student((Math.round(Math.random() * 100000)).toString(), 'F' + name, 'L' + name, new Date(), 'email' + name,
      'address' + name, 'zip' + name, 'count' + name, []);
    return new Grade('c' + name,
      Math.round(Math.random() * 100),
      new Date(),
      student
    );
  }
}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class ExampleDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  filteredData = [];
  renderedData = [];

  constructor(private _exampleDatabase: ExampleDatabase,
              private _paginator: MatPaginator,
              private _sort: MatSort) {
    super();

    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Grade[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this._exampleDatabase.data.slice().filter((item: Grade) => {
        /**
         * search to if all items in search terms appear in in search string
         * will return FALSE if one of the term doesn't appear in the string otherwise will return true
         * @param {string} searchStr
         * @param {string[]} searchTerms array of terms that will check if they appear in the searchSTR
         * @returns {boolean}
         */
        function checkFilter(searchStr: string, searchTerms: string[]) {
          if (searchTerms && searchStr) {
            for (const term of searchTerms) {
              if (searchStr.toLowerCase().indexOf(term) == -1) {
                return false;
              }
            }
          }
          return true;
        }

        function checkGeneralFilter(dataCell: Object, searchTerms: string[], convertorFunction) {
          for (let i = 0; i < searchTerms.length; i++) {
            if (searchTerms[i].startsWith('>')) {
              console.log('check number starting');
              // forward from the operator either by slicing or by incrementing the index
              if (searchTerms[i].length == 1) {
                i++;
              } else {
                searchTerms[i] = searchTerms[i].slice(1, searchTerms[i].length);
              }
              if (!(dataCell > convertorFunction(searchTerms[i]))) {
                console.log('check number - false', searchTerms[i], dataCell, i, searchTerms);
                return false;
              }
            } else if (searchTerms[i].startsWith('<')) {
              // forward from the operator either by slicing or by incrementing the index
              if (searchTerms[i].length == 1) {
                i++;
              } else {
                searchTerms[i] = searchTerms[i].slice(1, searchTerms[i].length);
              }
              if (!(dataCell < convertorFunction(searchTerms[i]))) {
                return false;
              }
            } else {
              if (searchTerms[i].startsWith('=')) {
                // forward from the operator either by slicing or by incrementing the index
                if (searchTerms[i].length == 1) {
                  i++;
                } else {
                  searchTerms[i] = searchTerms[i].slice(1, searchTerms[i].length);
                }
              }
              if (!(dataCell == convertorFunction(searchTerms[i]))) {
                return false;
              }
            }
          }
          console.log('check number - returned true');
          return true;
        }

        const filterString = this.filter.toLowerCase();
        const i = filterString.indexOf(':');
        if (i == -1) {
          // search each word in the search bar and see if it exists in one of the textual fields
          const searchStr = ([item.firstName, item.lastName, item.course, item.studentId, item.student ? item.student.country : '']
            .join(' ')).toLowerCase();

          for (const i of filterString.split(/[\s,:.-]+/)) {
            if (searchStr.indexOf(i) == -1) {
              return false;
            }
          }
          return true;
        } else {
          console.log('advanced filter');
          const allTerms = filterString.split(':');
          for (let idx = allTerms.length - 2 ; idx >= 0 ; idx--) {
            const beforeOperator = allTerms[idx].split(/[\s,:.-]+/);
            const searchTerms = allTerms[idx + 1].split(/[\s,:]+/);

            // if were not the last operator remove the last word for search which should be the column name
            if (idx != allTerms.length - 2) {
              searchTerms.splice(searchTerms.length - 1, 1);
            }


            if (beforeOperator.length > 0 && searchTerms.length > 0) {
              console.log('advanced filter start', beforeOperator, searchTerms);

              const searchByColumn = beforeOperator[beforeOperator.length - 1];
              switch (searchByColumn) {
                case 'name': {
                  if (!checkFilter(item.firstName + ' ' + item.lastName, searchTerms)) {
                    console.log('noName', item.firstName + ' ' + item.lastName, searchTerms);
                    return false;
                  }
                  break;
                }
                case 'id': {
                  if (!checkFilter(item.studentId, searchTerms)) {
                    return false;
                  }
                  break;
                }
                case 'course': {
                  if (!checkFilter(item.course, searchTerms)) {
                    return false;
                  }
                  break;
                }
                case 'email': {
                  if (item.student) {
                    if (!checkFilter(item.student.email, searchTerms)) {
                      return false;
                    }
                  }
                  break;
                }
                case 'country': {
                  if (item.student) {
                    if (!checkFilter(item.student.country, searchTerms)) {
                      return false;
                    }
                  }
                  break;
                }
                case 'grade': {
                  if (!checkGeneralFilter(item.grade, searchTerms, parseInt)) {
                    return false;
                  }
                  break;
                }
                case 'date': {
                  if (!checkGeneralFilter(item.date, searchTerms, x => new Date(x))) {
                    return false;
                  }
                  break;
                }
              }
            }
          }
          return true;
        }

      });

      // Sort filtered data
      const sortedData = this.sortData(this.filteredData.slice());

      // Grab the page's slice of the filtered sorted data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    });
  }

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  sortData(data: Grade[]): Grade[] {
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string|Date = '';
      let propertyB: number|string|Date = '';

      switch (this._sort.active) {
        // <!--'studentId', 'firstName', 'lastName', 'grade', 'course', 'gradeDate'-->
        case 'studentId': [propertyA, propertyB] = [a.studentId, b.studentId]; break;
        case 'firstName': [propertyA, propertyB] = [a.firstName, b.firstName]; break;
        case 'lastName': [propertyA, propertyB] = [a.lastName, b.lastName]; break;
        case 'course': [propertyA, propertyB] = [a.course, b.course]; break;
        case 'grade': [propertyA, propertyB] = [a.grade, b.grade]; break;
        case 'date': [propertyA, propertyB] = [a.date, b.date]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
