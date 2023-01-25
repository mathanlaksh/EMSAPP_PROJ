import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { EmployeeComponent } from './employee/employee.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { FilterEmployeePipe } from './filter-employee.pipe';
import { EmployeeAdminComponent } from './employee-admin/employee-admin.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DashboardEmployeeComponent } from './dashboard-employee/dashboard-employee.component';
import {EmpOperationModule} from './emp-operation/emp-operation.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: 
  [
    AppComponent,
    EmployeeComponent,
    SignupComponent,
    LoginComponent,
    FilterEmployeePipe,
    EmployeeAdminComponent,
    DashboardAdminComponent,
    DashboardEmployeeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    EmpOperationModule,
    SharedModule,    
    
  ],
  exports:[
    AppRoutingModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
