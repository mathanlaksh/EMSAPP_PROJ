import { NgModule } from '@angular/core';
import { LeaveDetailsComponent } from './leave-details/leave-details.component';
import { LeaveApplyComponent } from './leave-apply/leave-apply.component';
import { PermissionApplyComponent } from './permission-apply/permission-apply.component';
import { HeaderComponent } from '../header/header.component';
import { AppModule } from '../app.module';
import { SharedModule } from '../shared/shared.module';
import { LeavePrevilegesComponent } from './leave-previleges/leave-previleges.component';
import { LeaveRecordReportComponent } from './leave-record-report/leave-record-report.component';
import { LeaveTypeComponent } from './leave-type/leave-type.component';
import { LeaveTypeReportComponent } from './leave-type/leave-type-report/leave-type-report.component';

@NgModule({
  declarations: [
    LeaveDetailsComponent, 
    LeaveApplyComponent,
    PermissionApplyComponent,
    LeavePrevilegesComponent,
    LeaveRecordReportComponent,
    LeaveTypeComponent,
    LeaveTypeReportComponent
   ],
  imports: [
    SharedModule,
    ],
  exports: [

  ]
  
})
export class EmpOperationModule { 
  static forRoot(){
    return {
      NgModule:AppModule,
      HeaderComponent
    }
  }
}
