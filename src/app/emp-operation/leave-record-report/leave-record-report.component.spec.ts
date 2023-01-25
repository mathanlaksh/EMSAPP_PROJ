import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRecordReportComponent } from './leave-record-report.component';

describe('LeaveRecordReportComponent', () => {
  let component: LeaveRecordReportComponent;
  let fixture: ComponentFixture<LeaveRecordReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveRecordReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveRecordReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
