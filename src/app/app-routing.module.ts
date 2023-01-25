import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NGB_DATEPICKER_DATE_ADAPTER_FACTORY } from '@ng-bootstrap/ng-bootstrap/datepicker/adapters/ngb-date-adapter';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DashboardEmployeeComponent } from './dashboard-employee/dashboard-employee.component';
import { LeaveApplyComponent } from './emp-operation/leave-apply/leave-apply.component';
import { LeaveDetailsComponent } from './emp-operation/leave-details/leave-details.component';
import { LeavePrevilegesComponent } from './emp-operation/leave-previleges/leave-previleges.component';
import { LeaveRecordReportComponent } from './emp-operation/leave-record-report/leave-record-report.component';
import { LeaveTypeReportComponent } from './emp-operation/leave-type/leave-type-report/leave-type-report.component';
import { LeaveTypeComponent } from './emp-operation/leave-type/leave-type.component';
import { EmployeeAdminComponent } from './employee-admin/employee-admin.component';
import { EmployeeComponent } from './employee/employee.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: '', component: SignupComponent },
  { path: 'employee', component: EmployeeComponent },
  { path: 'signUp', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'employee-admin', component: EmployeeAdminComponent },
  { path: 'employee-dashboard', component: DashboardEmployeeComponent },
  { path: 'admin-dashboard', component: DashboardAdminComponent },
  { path: 'leave-apply', component: LeaveApplyComponent },
  { path: 'leave-details', component: LeaveDetailsComponent },
  { path: 'leave-privilege', component: LeavePrevilegesComponent },
  { path: 'leave-record-report', component: LeaveRecordReportComponent },
  { path: 'leave-type', component: LeaveTypeComponent },
  {
    path: 'leave-type-report', component: LeaveTypeReportComponent
  }

  // { path: 'view-leave-apply-details', component: LeaveApplyComponent },


];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
