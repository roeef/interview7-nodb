import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartByCourseComponent } from './chart-by-course.component';

describe('ChartByCourseComponent', () => {
  let component: ChartByCourseComponent;
  let fixture: ComponentFixture<ChartByCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartByCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartByCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
