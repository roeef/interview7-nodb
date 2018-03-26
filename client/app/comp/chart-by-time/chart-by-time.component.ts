import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {AmChart, AmChartsService} from '@amcharts/amcharts3-angular';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import Grade from '../../../models/grade';
import {StudentService} from '../../services/student.service';
import AvgCounter from '../../../models/avgCounter';
import moment = require('moment');
import {UiStatesService} from '../../services/ui-states.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-chart-by-time',
  templateUrl: './chart-by-time.component.html',
  styleUrls: ['./chart-by-time.component.css']
})
export class ChartByTimeComponent implements OnInit, OnDestroy, AfterViewInit {

  chart: AmChart;
  dataProvider = [];
  private studentsDataChange: BehaviorSubject<Grade[]> = this.studentsService.getGrades();
  constructor(private studentsService: StudentService, private uiState: UiStatesService,
              private AmCharts: AmChartsService) { }

  displayDataChanges = [
      this.uiState.stats.studentFilterChange,
      this.studentsDataChange
  ];

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.studentsDataChange = this.studentsService.getGrades();
      // console.log(grades);
    this.prepareDataForChart();

    console.log(this.dataProvider);
    this.chart = this.AmCharts.makeChart('chartdiv', {
      'hideCredits': true,
      'type': 'serial',
      'theme': 'light',
      'marginRight': 40,
      'marginLeft': 40,
      'autoMarginOffset': 20,
      'mouseWheelZoomEnabled': true,
      'dataDateFormat': 'YYYY-DD-MM',
      'valueAxes': [{
        'id': 'v1',
        'axisAlpha': 0,
        'position': 'left',
        'ignoreAxisWidth': true
      }],
      'balloon': {
        'borderThickness': 1,
        'shadowAlpha': 0
      },
      'graphs': [{
        'id': 'g1',
        'balloon': {
          'drop': true,
          'adjustBorderColor': false,
          'color': '#ffffff'
        },
        'bullet': 'round',
        'bulletBorderAlpha': 1,
        'bulletColor': '#FFFFFF',
        'bulletSize': 5,
        'hideBulletsCount': 50,
        'lineThickness': 2,
        'title': 'red line',
        'useLineColorForBulletBorder': true,
        'valueField': 'value',
        'balloonText': '<span style=\'font-size:18px;\'>[[value]]</span>'
      }],
      'chartCursor': {
        'pan': true,
        'valueLineEnabled': true,
        'valueLineBalloonEnabled': true,
        'cursorAlpha': 1,
        'cursorColor': '#258cbb',
        'limitToGraph': 'g1',
        'valueLineAlpha': 0.2,
        'valueZoomable': true
      },
      'categoryField': 'date',
      'categoryAxis': {
        'parseDates': true,
        'dashLength': 1,
        'minorGridEnabled': true
      },
      'export': {
        'enabled': true
      },
      'dataProvider': Object.values(this.dataProvider)
    });

    let zoomChart = () => this.chart.zoomToIndexes(this.chart.dataProvider.length - 40, this.chart.dataProvider.length - 1);
    this.chart.addListener('rendered', zoomChart);
    zoomChart();

    Observable.merge(...this.displayDataChanges).subscribe(() => {
      this.prepareDataForChart();
      console.log('aaabbb', this.dataProvider);
      this.AmCharts.updateChart(this.chart, () => {
        this.chart.dataProvider = Object.values(this.dataProvider);
      });
    });
  }

  private prepareDataForChart() {
    this.dataProvider = this.reduce(this.mapGrades(this.filterGrade(this.studentsDataChange.getValue())));
  }

  private reduce(mapped: any) {
    return mapped.reduce((acc, obj) => {
      console.log(obj);
      if (acc[obj.date]) {
        acc[obj.date].addItem(obj.value);
      } else {
        acc[obj.date] = new AvgCounter(obj.value, obj.date);
      }
      return acc;
      // return acc[obj.date] ? (new AvgCounter(obj.grade)) : acc[obj.date].addItem(obj.gradeDataChange);
    }, {});
  }

  private mapGrades(grades) {
    const mapped = grades.map((item) => {
      return item ? {'date': moment(item.date).format('YYYY-DD-MM'), 'value': item.grade} : null;
    });
    return mapped;
  }

  private filterGrade(grades) {
    grades = grades.filter(x => {
      if (0 >= x.grade) {
        return false;
      }
      if (!this.uiState.stats.studentFilter || this.uiState.stats.studentFilter.length == 0 || this.uiState.stats.studentFilter.includes('-1' )) {
        return true;
      }
      return this.uiState.stats.studentFilter.includes(x.studentId);
    });
    return grades;
  }

  ngOnDestroy() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }

}
