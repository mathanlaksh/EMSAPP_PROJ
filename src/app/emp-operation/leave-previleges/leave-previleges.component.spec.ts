import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavePrevilegesComponent } from './leave-previleges.component';
import 'jasmine';
describe('LeavePrevilegesComponent', () => {
  let component: LeavePrevilegesComponent;
  let fixture: ComponentFixture<LeavePrevilegesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeavePrevilegesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavePrevilegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
