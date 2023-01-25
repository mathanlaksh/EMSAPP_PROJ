import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { LeaveType } from 'src/app/models/leaveType.model';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-leave-type-report',
  templateUrl: './leave-type-report.component.html',
  styleUrls: ['./leave-type-report.component.css']
})
export class LeaveTypeReportComponent implements OnInit {
  enteredSearchValue: any;
  leaveTypes: LeaveType[] = [];
  session: any;
  constructor(private service: ApiService,
    private dataService: SharedDataService,
    private router: Router) {

  }

  @Input() editRequest: LeaveType = {
    leaveTypeId: 0,
    leaveTypeName: '',
    max_limit: 0,
    description: ''
  };
  @Output() messageEvent = new EventEmitter<string>();


  getSessionData() {

    if (this.service.getUserSession('userKey')) {
      var data: any = this.service.getUserSession('userKey');
      this.session = JSON.parse(data);
    }
  }
  getLeaveType() {
    this.service.getLeaveType().subscribe({
      next: (obs) => {
        this.leaveTypes = obs;
        console.log('this.leaveprivileges,admin', this.leaveTypes);
      }, error: (err) => {
        Swal.fire('Error-On-GET', 'error occured when getting privileges', 'error');
      }
    })
  }

  addLeaveType() {
    this.router.navigateByUrl('/leave-type')
  }
  onEditLeaveType(data: LeaveType) {
    this.editRequest = data;
    console.log('edit', this.editRequest, data);
    this.dataService.editLeaveType(data);
    this.router.navigateByUrl('/leave-type');
  }

  onDeleteLeaveType(lt: LeaveType) {

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.service.deleteLeaveType(lt.leaveTypeId).subscribe({
            next: res => {
              this.getLeaveType();
              Swal.fire({
                toast:true,
                title: 'Deleted',
                position:'top-right',
                text: "your file has been deleted",
                icon: 'success',
                timer: 5000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter',
                    Swal.stopTimer)
                  toast.addEventListener('mouseleave',
                    Swal.resumeTimer)
                }
            })
            }, error: err => {
              Swal.fire(
                'Error!',
                'Your file could not be deleted.',
                'error'
              )
            }
          });

        }
      })
  }
  ngOnInit() {
    console.log('ngonint fired');
    
    this.getSessionData();
    this.getLeaveType();
  }


}
