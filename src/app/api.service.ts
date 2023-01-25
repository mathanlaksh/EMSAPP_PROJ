import { Injectable, IterableDiffers } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, toArray } from 'rxjs/operators';
import { Employee } from './models/employee.model';
import { User } from './models/user.model';
import { LeaveType } from './models/leaveType.model';
import { Holiday } from './models/holiday.model';
import { LeaveApply } from './models/leaveApply.model';
import { UrlSegment } from '@angular/router';
import { LeavePrivilege } from './models/leavePrivilege.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  employees: any;

  baseApiUrl: string = "http://localhost:3000/";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private http: HttpClient) {
  }

  getAllEmployeeData(): Observable<Employee[]> {
    
    return this.http.get<Employee[]>(this.baseApiUrl + 'employees')
      .pipe(
        catchError(throwError)
      )
  }

  getEmployeeDataByEmail(userName: string): Observable<Employee> {
    return this.http.get<Employee>(this.baseApiUrl + 'employees?email=' + userName)
      .pipe(
        catchError(throwError),
      )
  }

  
  addEmployeeData(addEmployeeRequest: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.baseApiUrl + 'employees', JSON.stringify(addEmployeeRequest), this.httpOptions);
  }
  updateEmployeeData(id: number, updateRequest: Employee): Observable<Employee> {
    
    return this.http.put<Employee>(this.baseApiUrl + 'employees/' + id, JSON.stringify(updateRequest), this.httpOptions)
      .pipe(
        catchError(throwError),
      )
  }
  deleteEmployeeData(id: number) {
    return this.http.delete<Employee>(this.baseApiUrl + 'employees/' + id, this.httpOptions)
      .pipe(catchError(throwError),
      )
  }

  uploadFile(file: FormData): any {
    return this.http.post(this.baseApiUrl + 'employees/upload_file/', file);
  }
  getEmployees(page: number) {
    return this.http.get(this.baseApiUrl + 'employees/get_page/' + '?page' + page)
  }

  /*------------------------Sign up form services ---------------*/
  addUserData(signUpRequest: User) {
    return this.http.post<User>(this.baseApiUrl + 'users/', JSON.stringify(signUpRequest), this.httpOptions);
  }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseApiUrl + 'users');
  }
  getUsersbyRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(this.baseApiUrl + 'users?userRole=' + role);
  }
  loginUser(loginRequest: User) {
    return this.http.post(this.baseApiUrl + 'users/', JSON.stringify(loginRequest), this.httpOptions);
  }
  getUserSession(userData: any) {
    return localStorage.getItem(userData);
  }
  setUserSession(userKey: string, userData: any) {
    return localStorage.setItem(userKey, userData);
  }
  removeUserSession(userData: any) {
    return localStorage.removeItem(userData);
  }

  /*------------------------Sign up form services  End---------------*/

  /*-----------------------------Leave Type Services Start ----------------*/
  getLeaveType(): Observable<LeaveType[]> {
    return this.http.get<LeaveType[]>(this.baseApiUrl + 'LeaveTypes')
      .pipe(
        catchError(throwError),
      );
  }

  addLeaveType(leaveTypeRequest: LeaveType): Observable<LeaveType> {
    return this.http.post<LeaveType>(this.baseApiUrl + 'LeaveTypes', JSON.stringify(leaveTypeRequest), this.httpOptions)
      .pipe(
        catchError(throwError)
      );
  }
  updateLeaveType(id: number, updateRequest: LeaveType): Observable<LeaveType> {
    return this.http.put<LeaveType>(this.baseApiUrl + 'LeaveTypes/' + id, JSON.stringify(this.updateLeaveType), this.httpOptions)
      .pipe(catchError(throwError));
  }
  deleteLeaveType(id: number) {
    return this.http.delete(this.baseApiUrl + 'LeaveTypes/' + id)
      .pipe(catchError(throwError))
  }
  /*-----------------------------Leave Type Services End ----------------*/

  /*------------------------Leave Apply form services Start---------------*/

  applyLeave(leaveRequest: LeaveApply): Observable<LeaveApply> {
    return this.http.post<LeaveApply>(this.baseApiUrl + 'LeaveDetails', JSON.stringify(leaveRequest), this.httpOptions);
  }
  getAllLeaveDetails(): Observable<LeaveApply[]> {
    return this.http.get<LeaveApply[]>(this.baseApiUrl + 'LeaveDetails', this.httpOptions)
      .pipe(catchError(throwError));
  }
  getLeaveToDisplay(leaveId: number): Observable<LeaveApply>{
    return this.http.get<LeaveApply> (this.baseApiUrl + 'LeaveDetails?leaveId='+leaveId,this.httpOptions)
    .pipe(catchError(throwError));
  }

  getEmployeeLeaveDetails(empId: number): Observable<LeaveApply[]> {
    return this.http.get<LeaveApply[]>(this.baseApiUrl + 'LeaveDetails?empId=' + empId)
      .pipe(
        catchError(throwError)
      )
  }
  updateLeaveDetailById(empId: number, updateRequest: LeaveApply): Observable<LeaveApply> {    
    return this.http.put<LeaveApply>(this.baseApiUrl + 'LeaveDetails/' + empId, JSON.stringify(updateRequest), this.httpOptions)
      .pipe(catchError(throwError));
  }
  updateApproversByLeaveId(leaveId: number, approverData: LeaveApply): Observable<LeaveApply>{
    return this.http.put<LeaveApply>(this.baseApiUrl + 'LeaveDetails/' + leaveId,JSON.stringify(approverData),this.httpOptions)
    .pipe(catchError(throwError));
  }
  /*------------------------Leave Apply form services End---------------*/




  /*--------------------------Leave Privilege SERVICE START----------------------------------*/

  addLeavePrivilege(previlegeRequest: LeavePrivilege): Observable<LeavePrivilege> {
    return this.http.post<LeavePrivilege>(this.baseApiUrl + 'LeavePrivileges/', JSON.stringify(previlegeRequest), this.httpOptions)
      .pipe(catchError(throwError));
  }
  getLeaveApproverByEmpId(empId: number): Observable<LeavePrivilege[]> {
    return this.http.get<LeavePrivilege[]>(this.baseApiUrl + 'LeavePrivileges?empId=' + empId)
      .pipe(catchError(throwError));
  }
  getLeaveApproverByUserId(userId: number): Observable<LeavePrivilege[]> {
    return this.http.get<LeavePrivilege[]>(this.baseApiUrl + 'LeavePrivileges?userId=' + userId)
      .pipe(catchError(throwError));
  }
  getLeaveApproverByLeaveId(leaveId: number): Observable<any[]>{
    return this.http.get<any[]>(this.baseApiUrl+'LeavePrivileges?leaveId=' + leaveId)
    .pipe(catchError(throwError));
  }
  getLeavePrivilege(): Observable<LeavePrivilege[]> {
    return this.http.get<LeavePrivilege[]>(this.baseApiUrl + 'LeavePrivileges')
      .pipe(catchError(throwError));
  }
  
  /*--------------------------Leave Privilege SERVICE END----------------------------------*/

  /*---------------Holiday service start --------------------*/
  getHolidayList(): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(this.baseApiUrl + 'HolidayDetails')
      .pipe(
        catchError(throwError),
      );
  }

  getLeaveDetails(): Observable<LeaveApply[]> {
    return this.http.get<LeaveApply[]>(this.baseApiUrl + 'LeaveDetails')
  }



  /*---------------Holiday service start --------------------*/



}

