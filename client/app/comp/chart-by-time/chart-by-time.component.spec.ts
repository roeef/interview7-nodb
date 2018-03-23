import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartByTimeComponent } from './chart-by-time.component';

describe('ChartByTimeComponent', () => {
  let component: ChartByTimeComponent;
  let fixture: ComponentFixture<ChartByTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartByTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartByTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
