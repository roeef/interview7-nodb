import {ElementRef, Injectable} from '@angular/core';
import Student from '../../models/student';
import Grade from '../../models/grade';
import {StudentService} from './student.service';
import {DataSource, SelectionChange, SelectionModel} from '@angular/cdk/collections';
import {SomeDataSourceModule} from '../modules/some-data-source/some-data-source.module';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

class DetailsState {
  grade: Grade = new Grade();
  get student() { return this.grade.student; }
  hasCahnged = false;
  isNew = true;
}

class GridState {
  selection = new SelectionModel<Grade>(false, []);
  filtreValue: string;
  dataSource: SomeDataSourceModule | null;
}


class StatsPageState {
  studentFilterChange = new BehaviorSubject<string>('');
  set studentFilter(x: string) {
    this.studentFilterChange.next(x);
  }
  get studentFilter() {
    return this.studentFilterChange.getValue();
  }
}

@Injectable()
export class UiStatesService {
  detailsState: DetailsState = new DetailsState();
  grid: GridState = new GridState();
  filterValue: string;
  stats = new StatsPageState();

  constructor(private student: StudentService) {
    this.grid.selection.onChange.subscribe(x => {
      console.log('Selection Changed');
      // On Selection Change check if a new selection is availble for editing
      if (x.added[0]) {
        // Copy object to seperate from grid... TODO consider moving copy to before slection would protect block changes
        Object.assign(this.detailsState.grade, x.added[0]);
        this.detailsState.grade.student = Object.assign(new Student(), x.added[0].student);
        this.detailsState.grade.date = new Date(x.added[0].date);

        // change from new to edit mode
        this.detailsState.isNew = false;
        this.detailsState.hasCahnged = false;
      } else if (this.grid.selection.selected.length === 0) {
        // an Item was unselected switch back to new "User" in the details
        this.detailsState.grade = new Grade();
        // Cancel Edit mode
        this.detailsState.isNew = true;
        this.detailsState.hasCahnged = false;
      }
    });
  }

  addGrade() {
      this.grid.selection.clear();
      this.saveGrade();
  }

  saveGrade() {
    console.log(this.detailsState.grade);
    console.log(this.detailsState.grade.student);

    const grade = new Grade();
    this.student.addOrUpdate(Object.assign(grade, this.detailsState.grade));
    this.grid.selection.clear();
    this.grid.selection.toggle(grade);
  }

  discard() {
    this.grid.selection.clear();
  }
}
