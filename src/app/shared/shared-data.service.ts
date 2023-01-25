import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { LeaveApply } from '../models/leaveApply.model';
import { LeaveType } from '../models/leaveType.model';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
private editRequestSubject = new Subject<any>();
//private editRequestSubject = new EventEmitter<any>();
  constructor() { }

  passLeaveData():Observable<any> {
//    var data  = this.editRequestSubject.asObservable();
var data = this.editRequestSubject.asObservable();
    return data;

  }
  editLeaveRequest(lvd: LeaveApply) {
    this.editRequestSubject.next(lvd);
  }
  editLeaveType(lvt:LeaveType){
  this.editRequestSubject.next(lvt);
// this.editRequestSubject.emit(lvt);
  console.log('leave type ', this.editRequestSubject.next(lvt));
}

}
