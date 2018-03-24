import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {StudentService} from "../../services/student.service";
import {UiStatesService} from "../../services/ui-states.service";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  toppings = new FormControl();
  toppingList = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  constructor(private studService: StudentService, private uiState: UiStatesService) {
  }

  get studentService() {
    return this.studService;
  }

  ngOnInit() {
  }

}
