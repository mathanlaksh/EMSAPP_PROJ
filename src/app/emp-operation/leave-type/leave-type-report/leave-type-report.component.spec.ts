import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveTypeReportComponent } from './leave-type-report.component';

describe('LeaveTypeReportComponent', () => {
  let component: LeaveTypeReportComponent;
  let fixture: ComponentFixture<LeaveTypeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveTypeReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveTypeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
