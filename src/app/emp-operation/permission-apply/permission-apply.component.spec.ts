import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionApplyComponent } from './permission-apply.component';
import 'jasmine';

describe('PermissionApplyComponent', () => {
  let component: PermissionApplyComponent;
  let fixture: ComponentFixture<PermissionApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionApplyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
