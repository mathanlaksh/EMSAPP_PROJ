import { Component, OnInit, Input, AfterViewInit, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/api.service';
import { LeaveApply } from 'src/app/models/leaveApply.model';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { LeavePrivilege } from 'src/app/models/leavePrivilege.model';
import { User } from 'src/app/models/user.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-leave-details',
  templateUrl: './leave-details.component.html',
  styleUrls: ['./leave-details.component.css']
})
export class LeaveDetailsComponent implements OnInit, AfterViewInit {
  leaveDetails: LeaveApply[] = [];
  approvers: User[] = [];
  approverCount: number = 0;
  isUpdateModalBtn: boolean = false;
  isModalSubmitBtn: boolean = false;
  session: any;
  settings: IDropdownSettings = {};
  selectedApprList: any[] = [];

  leaveData: LeaveApply = {
    empId: 0,
    leaveId: 0,
    leaveTypeId: 0,
    leaveType: '',
    fromDate: '',
    toDate: '',
    status: '',
    remarks: '',
    no_of_leave_taken: 0,
    no_of_availedLeave: 0,
    max_limit: 0,
    lv_approver: []
  };
  showAddEditApprvrModal: boolean = false;
  displayAddEditModal: any = 'none';
  @Input() leaveDataReq: any
  //@Output() editRequest : EventEmitter<LeaveApply> = new EventEmitter();
  form: FormGroup = new FormGroup({
    myApprovers: new FormControl('')
  });


  constructor(private apiService: ApiService,
    private toastr: ToastrService, private router: Router,
    private route: ActivatedRoute,
    private dataService: SharedDataService,
    private formBuilder: FormBuilder) {
  }

  getSessionData() {
    if (this.apiService.getUserSession('userKey')) {
      var data: any = this.apiService.getUserSession('userKey');
      this.session = JSON.parse(data);
      console.log('getSession', this.session);
    }
  }

  getAllLeaveDetails() {
    this.apiService.getAllLeaveDetails().subscribe({
      next: data => {
        this.leaveDetails = data;
      },
      error: err => {
        Swal.fire('Error on Get Leave Data!', err, 'error');
      }
    })
  }
  getLeaveDetailsById() {
    this.leaveDetails = [];
    this.apiService.getEmployeeLeaveDetails(this.session.id).subscribe({
      next: (leavedtls) => {

        this.leaveDetails = leavedtls;
        //  this.filteredEmployees =this.employees;
        console.log('leave details', this.leaveDetails);
      },
      error: (response) => {
        this.toastr.error('error', response);
      }
    });
  }



  onEditLeaveData(lvd: LeaveApply) {
    /*
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "leaveId": lvd.leaveId
      }
    };
    console.log('nav-extra', navigationExtras);
    //this.router.navigateByUrl('/leave-apply',navigationExtras);
    */

    this.dataService.editLeaveRequest(lvd);

    this.router.navigate(['/leave-apply', { leaveId: lvd.leaveId }]);
    this.leaveDataReq = lvd;
    //  this.router.navigate(['/leave-apply', { fromDate: this.leaveData.fromDate, toDate: this.leaveData.toDate, leaveTypeId: this.leaveData.leaveTypeId, remarks: this.leaveData.remarks }]);
  }

  onCancelLeave(lvd: LeaveApply) {
    Swal.fire({
      title: 'Are you sure you want to cancel?',
      text: 'You will not be able to modified this leave!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel it',
      cancelButtonText: 'No, Keep it',
    }).then(async (res) => {
      if (res.isConfirmed) {
        const value: any = await Swal.fire({
          input: 'textarea',
          inputLabel: 'why you want to do cancel this leave?',
          inputPlaceholder: 'Type your message here...',
          inputAttributes: {
            'aria-label': 'Type your message here'
          },
        }).then((r) => {
          lvd.remarks = r.value;
          lvd.status = "Cancelled";
          console.log('leave -cancel', lvd)
          this.apiService.updateLeaveDetailById(lvd.empId, lvd).subscribe(res => {
            console.log('res', res);
            this.getLeaveDetailsById();
          });
          Swal.fire({
            title: 'Cancel Staus !',
            text: 'You have cancelled this leave request !',
            icon: 'info',
            toast: true,
            position: 'top-right'
          })
        })
      }
      else {
        Swal.fire('Revert !', 'You have not modified anything', 'info');
      }
    })
  }
  onRejectLeave(lvd: LeaveApply) {
    Swal.fire({
      title: 'Are you sure you want to reject this leave?',
      text: 'once rejected you can not modified !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes,Reject It !',
      cancelButtonText: 'No, Revert It!',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then(async res => {
      if (res.isConfirmed) {
        const value: any = await Swal.fire({
          input: 'textarea',
          inputLabel: 'please give the reason',
          inputPlaceholder: 'type your message here....',
          inputAttributes: {
            'aria-label': 'remarks'
          },
        }).then(r => {
          lvd.remarks = r.value;
          lvd.status = 'Rejected';
          console.log('reject-r', r)
          this.apiService.updateLeaveDetailById(lvd.empId,lvd).subscribe(obs => {
            console.log('obs-reject',obs);
            this.getLeaveDetailsById();
          });
          Swal.fire({
            title: 'Leave Rejection !',
            text: 'You have rejected the leave request !',
            icon: 'info',
            toast: true,
            position: 'top-right'
          })
        });
      }
    })
  }


  onApproveLeave(lvd: LeaveApply) {
const rest_appr:any = lvd.lv_approver?.filter(i => i.id != this.session.id);
this.selectedApprList = [];
this.selectedApprList = rest_appr;
console.log('selected list approver',rest_appr, this.selectedApprList);
if(lvd.lv_approver?.length !== undefined &&  lvd.lv_approver?.length > 1){
  if(rest_appr !== undefined && rest_appr?.length>0){
    lvd.status ='In Progress';
    lvd.remarks = lvd.remarks=='' ? ('approved by: '+ this.session.userName+ ' ' + 'r.value'):lvd.remarks + ' '+ '<br/>'+ ('approved by: '+ this.session.userName+ ' ' + 'r.value');
    this.selectedApprList=rest_appr;
    console.log('reassign apprver',this.selectedApprList);
  }
}
else {                      
  lvd.status = 'Approved';
  lvd.remarks = 'approver: '+ this.session.userName+ ' ' + 'r.value' ;
}

    /* Swal.fire({
       title: 'Are you sure you want to Approve this leave?',
       text: 'once approved you can not modified !',
       icon: 'warning',
       showCancelButton: true,
       confirmButtonText: 'Yes, Approve It !',
       cancelButtonText: 'No, Revert It!'
     }).then(async res => {
       if (res.isConfirmed) {
         const value: any = await Swal.fire({
           input: 'textarea',
           inputLabel: 'You may type some remarks here?',
           inputPlaceholder: 'type your message here....',
           inputAttributes: {
             'aria-label': 'remarks'
           },
         }).then(r => {
          if(lvd.lv_approver?.length !== undefined &&  lvd.lv_approver?.length > 1){
            if(rest_appr !== undefined && rest_appr?.length>0){
              lvd.status ='In Progress';
              lvd.remarks = 'approved by: '+ this.session.userName+ ' ' + r.value ;
              this.selectedApprList=rest_appr;
              console.log('reassign apprver',this.selectedApprList);
            }
          }
          else {                      
            lvd.status = 'Approved';
            lvd.remarks = 'approver: '+ this.session.userName+ ' ' + r.value ;
          }
           this.apiService.updateLeaveDetailById(lvd.empId, lvd).subscribe(obs => {
             console.log('obs-approve', obs);
             this.getLeaveDetailsById();
           })
           Swal.fire({
             title: 'Leave Approval Staus !',
             text: 'You have approved this leave request !',
             icon: 'success',
             toast: true,
             position: 'top-right'
           })
         });
       }
     }) */
  }
  getAllUsers() {
    this.apiService.getAllUsers().subscribe({
      next: (obs) => {
        this.approvers = obs.filter(i => i.userRole !== 'Employee');
        console.log('approvers', this.approvers);
      },
      error: err => {
        Swal.fire('error on get All users', err, 'error');
      }
    });
  }
  // getLeavePrivilegeByUserId() {    
  //   this.apiService.getLeaveApproverByUserId(this.session.id).subscribe({
  //     next: approvers => {

  //       console.log('approver-admin-data',approvers)
  //      this.approvers = approvers.map(i => i.lv_approver.length>0);
  //         console.log('approvers-admin-map',this.approvers);
  //     }, error: err => {
  //       Swal.fire('Error-On-GET', 'error occured when getting approvers', 'error');
  //     }
  //   });
  // }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        myApprovers: ['', Validators.required]
      }
    );

    this.settings = {
      idField: 'id',
      textField: 'userName',
    };


    //  this.refreshPage();
    this.getSessionData();
    this.getAllUsers();

    if (this.session.userRole == 'Admin') {
      this.getAllLeaveDetails();


    } else {
      this.getLeaveDetailsById();
    }

  }

  get f() {
    return this.form.controls;
  }
  onAssignApprover(lvd: any) {
    this.showAddEditApprvrModal = true;
    this.displayAddEditModal = 'block';
    this.leaveData = lvd;
    if (lvd.lv_approver.length > 0) {
      this.selectedApprList = lvd.lv_approver;      
    }
    else {      
      //this.leaveData.leaveId = lvd.leaveId;
      this.leaveData.lv_approver = this.selectedApprList;
    }    
  }
  onCloseApproverModal() {
    if (this.showAddEditApprvrModal == true) {
      this.displayAddEditModal = 'none';
      this.showAddEditApprvrModal = false;
      this.isUpdateModalBtn = false;
    }
    this.form.reset();

  }

  mapFormData() {
    console.log('map-selectedaprlist', this.selectedApprList);
    this.leaveData.lv_approver = this.selectedApprList;
  }

  onUpdateApprovers() {
    if (this.form.invalid) {
      return
    }

    this.mapFormData();
    console.log('leave data', this.leaveData)
    this.apiService.updateApproversByLeaveId(this.leaveData.leaveId, this.leaveData).subscribe({
      next: res => {
        this.getAllLeaveDetails();
        this.onCloseApproverModal();
        Swal.fire('Approver Assigned !', 'You have assigned approver for this leave', 'success');
      },
      error: err => {
        Swal.fire('Error-On-update approvers', 'error occured when getting privileges', 'error');
      }
    })

  }

  ngAfterViewInit(): void {
    if (this.session.userRole == 'Admin') {
      // this.getLeavePrivilegeByUserId();
    }
  }

}
``