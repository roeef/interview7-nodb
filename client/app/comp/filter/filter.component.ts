import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {StudentService} from '../../services/student.service';
import {UiStatesService} from '../../services/ui-states.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  constructor(private uiStateService: UiStatesService) { }
  get state() {
    return this.uiStateService;
  }

  get dataSource() {
    return this.uiStateService.grid.dataSource;
  }

  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    // Observable for the filter
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

}
