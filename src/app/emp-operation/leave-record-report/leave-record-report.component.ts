import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { LeavePrivilege } from 'src/app/models/leavePrivilege.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-leave-record-report',
  templateUrl: './leave-record-report.component.html',
  styleUrls: ['./leave-record-report.component.css']
})
export class LeaveRecordReportComponent implements OnInit{
  enteredSearchValue: any;
  leavePrivileges: LeavePrivilege[] = [];
  session:any;
constructor(private service: ApiService, private router: Router){

}

getSessionData() {

  if (this.service.getUserSession('userKey')) {
    var data: any = this.service.getUserSession('userKey');
    this.session = JSON.parse(data);
console.log('session data',this.session)
    if(this.session.userRole == 'Employee'){
      this.getLeaveReportById();
      }
      else if(this.session.userRole == 'Admin'){
        
        this.getLeavePrivilegeList();
      }
  }
}
getLeavePrivilegeList(){
  this.service.getLeavePrivilege().subscribe({
   next: (obs)=>{
      this.leavePrivileges = obs;
      console.log('this.leaveprivileges,admin', this.leavePrivileges);
    },error: (err) =>{
      Swal.fire('Error-On-GET','error occured when getting privileges', 'error');
    }
  })
}
getLeaveReportById(){
  this.service.getLeaveApproverByUserId(this.session.id).subscribe({
    next: (res)=>{
       this.leavePrivileges= res;
       console.log('this.leaveprivileges,employee', this.leavePrivileges);
     },error: (err) =>{
       Swal.fire('Error-On-GET','error occured when getting privileges', 'error');
     }
   })
}
addLeaveRecord(){
  this.router.navigateByUrl('/leave-privilege');
}
ngOnInit() {

this.getSessionData();

}

// getUserName(userId:number){
//   var result =this.session.filter(i => i.empId == userId)?.emp_RollNo;
//   return result;
// }



}
