import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {UiStatesService} from '../../services/ui-states.service';

@Component({
  selector: 'app-details-panel',
  templateUrl: './details-panel.component.html',
  styleUrls: ['./details-panel.component.css']
})
export class DetailsPanelComponent implements OnInit {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  get state() {
    return this.uiStateService.detailsState;
  }
  get student() {
    return this.state.student;
  }
  get grade() {
    return this.state.grade;
  }

  constructor(private uiStateService: UiStatesService) { }

  ngOnInit() {
  }

}
