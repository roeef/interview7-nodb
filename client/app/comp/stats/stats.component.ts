import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {StudentService} from '../../services/student.service';
import {UiStatesService} from '../../services/ui-states.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  constructor(private studService: StudentService, private uiState: UiStatesService) {
  }
  formControl = new FormControl();
  selected = [];
  get state() {
    return this.uiState.stats;
  }



  get studentService() {
    return this.studService;
  }

  ngOnInit() {
    this.studentService.getStudents().subscribe(value =>
      console.log(value)
    );
  }

}
