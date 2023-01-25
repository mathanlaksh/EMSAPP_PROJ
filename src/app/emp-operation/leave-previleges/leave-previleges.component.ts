import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/api.service';
import { LeaveType } from 'src/app/models/leaveType.model';
import { User } from 'src/app/models/user.model';
import { LeavePrivilege } from 'src/app/models/leavePrivilege.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-leave-previleges',
  templateUrl: './leave-previleges.component.html',
  styleUrls: ['./leave-previleges.component.css']
})
export class LeavePrevilegesComponent implements OnInit {
leavePrivilege: LeavePrivilege = {
userId:0,
empId:0,
leaveTypeId:0,
no_of_lv_assigned:0,
description:'',
leaveType:'',
  }

  showDropDown:boolean =false;
  submitted: boolean = false;
  leaveTypes: LeaveType[] = [];
  users: User[] = [];
  approvers: User[] = [];
  session: any ; 
  constructor(private toast: ToastrService,
    private formbuilder: FormBuilder,
    private service: ApiService, private router: Router) {

    this.form.controls['selectedEmpId'].setValue(-1);
    this.form.controls['category'].setValue(-1);
  }

  ngOnInit() {
    this.form = this.formbuilder.group(
      {
        selectedEmpId: ['',Validators.required],
        category: ['', Validators.required],
        noOfLeaves: ['', Validators.required],
        description: ['', Validators.required],        
      }
    );

    this.getSessionData();
    this.getLeaveType();
    this.getAllUsers();    
  }

  get f() {
    return this.form.controls;
  }

  form: FormGroup = new FormGroup({
    selectedEmpId: new FormControl(''),
    category: new FormControl(''),
    noOfLeaves: new FormControl(''),
    description: new FormControl(''),
    myApprovers: new FormControl('')
  });

  
/*------------get data from services Start---------------------*/

getSessionData() {
  if (this.service.getUserSession('userKey')) {
    var data: any = this.service.getUserSession('userKey');
    this.session = JSON.parse(data);
  }
}

getLeaveType() {
  this.service.getLeaveType().subscribe({
    next: (res) => {
      this.leaveTypes = res;
    },
    error: (err) => {
     this.toast.error('error-leavetype', err);
    }
  });
}

getAllUsers(){

this.service.getAllUsers().subscribe({
  next: (res) => {
    this.users = res.filter(i => i.userRole.toLowerCase() == 'employee');
    this.approvers = res.filter(i => i.userRole.toLowerCase() !== 'employee');
    console.log('users1,approvers1',this.users,this.approvers);
  }, error: (err)=>{

  }
});
}
/*------------get data from services End ---------------------*/


  onChangeLeaveCategory(event: any) {

    if (this.leavePrivilege.leaveTypeId == null ||
      this.leavePrivilege.leaveTypeId == undefined || this.leavePrivilege.leaveTypeId == -1) {
      this.leavePrivilege.leaveTypeId = 0;
      this.leavePrivilege.leaveType = "";
    }
    if (event !== null && event !== undefined) {
      this.leavePrivilege.leaveTypeId = event;
      this.leavePrivilege.leaveType = this.leaveTypes.find(i => i.leaveTypeId == this.leavePrivilege.leaveTypeId)?.leaveTypeName;
    }
  }

  onChangeUser(e: any) {
    this.leavePrivilege.empId = e;
    this.mapFormData();
  }

  mapFormData(){
    this.leavePrivilege.no_of_lv_assigned = this.form.controls['noOfLeaves'].value;
    this.leavePrivilege.description = this.form.controls['description'].value;
  }
  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    if (this.form.value !== null && this.form.value != undefined && this.form.controls['selectedEmpId'].value !== undefined && this.form.controls['category'].value !== undefined) {
     this.leavePrivilege.userId = this.session.id;
      this.mapFormData();

      this.service.addLeavePrivilege(this.leavePrivilege).subscribe(obs => {
        if(obs){
            Swal.fire(
              'Good job!',
              'Privilege added successfully',
              'success'
            ).then(res =>{
              this.onReset();
              this.router.navigateByUrl('/leave-record-report');
            });
          }
          else {
            Swal.fire(
              'Error',
              'Error on Add privilege',
              'error'
            )
          }
      })
      console.log('submit', this.form,this.leavePrivilege);
    }
  }

  onReset(){
    this.submitted = false;
    this.form.reset();
    this.form.controls['selectedEmpId'].setValue(-1);
    this.form.controls['category'].setValue(-1);
    this.clearData();
  }

  clearData() {
    this.leavePrivilege.leaveType = '';
    this.leavePrivilege.description = '' ;
    this.leavePrivilege.leaveTypeId = 0;
    this.leavePrivilege.no_of_lv_assigned = 0;
    this.leavePrivilege.userId = 0;
    this.leavePrivilege.empId = 0;
  }

}
