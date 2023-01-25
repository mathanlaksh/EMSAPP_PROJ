import { AfterViewInit, Component, OnInit, ViewChild, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/api.service';
import { LeaveType } from 'src/app/models/leaveType.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LeaveTypeReportComponent } from './leave-type-report/leave-type-report.component';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { Subscription, timeout } from 'rxjs';
@Component({
  selector: 'app-leave-type',
  templateUrl: './leave-type.component.html',
  styleUrls: ['./leave-type.component.css'],
  changeDetection:ChangeDetectionStrategy.Default
  //changeDetection:ChangeDetectionStrategy.OnPush
})
export class LeaveTypeComponent implements OnInit, AfterViewInit, OnDestroy {  
  leaveType: LeaveType = {
    leaveTypeId: 0,
    leaveTypeName: '',
    max_limit: 0,
    description: ''
  }
  leaveTypes: LeaveType[] = [];
  submitted: boolean = false;
  session: any;
  @ViewChild(LeaveTypeReportComponent) editRequest: any;
//private editTypeSubscription: Subscription = new Subscription();
  constructor(private toast: ToastrService,
    private formbuilder: FormBuilder,
    private service: ApiService,
    private dataService: SharedDataService,
    private router: Router,
    private cf: ChangeDetectorRef
    ) {
//private cDRef:ChangeDetectorRef

  }

  ngOnInit() {
    this.form = this.formbuilder.group(
      {
        leaveTypeName: ['', Validators.required],
        maxLimit: ['', Validators.required],
        description: ['', Validators.required],
      }
    );
    this.getSessionData();
    this.getLeaveType();

    this.dataService.passLeaveData().subscribe({
      next: (obs) => {
        this.leaveType = obs;
        //this.cDRef.detectChanges();
        // this.form.get('leaveTypeName')?.setValue(obs.leaveTypeName);
        // this.form.get('description')?.setValue(obs.description);
        // this.form.get('maxLimit')?.setValue(obs.max_limit);
        setTimeout(()=>{
          console.log('timeout fired');
          this.form.controls['leaveTypeName'].setValue(obs.leaveTypeName);
          this.form.controls['description'].setValue(obs.description);
          this.form.controls['maxLimit'].setValue(obs.max_limit);
        },200);
        

        //this.form.updateValueAndValidity();
this.cf.detectChanges();
        console.log('obs-map', obs, this.form);

        //this.getDataFromParent();
      },
      error: err => {
        Swal.fire('Error-On-map-Obs', 'error occured when getting observables: ' + err, 'error');
      }
    })
  }
  ngAfterViewInit() { 
    //this.editTypeSubscription =       
      console.log('viewChild', this.editRequest);

  }


  get f() {
    return this.form.controls;
  }

  form: FormGroup = new FormGroup({
    leaveTypeName: new FormControl(''),
    max_limit: new FormControl(''),
    description: new FormControl(''),
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


  /*------------get data from services End ---------------------*/
  getDataFromParent() {
    this.form.controls['leaveTypeName'].setValue(this.leaveType.leaveTypeName)
    this.form.controls['maxLimit'].setValue(this.leaveType.max_limit);
    this.form.controls['description'].setValue(this.leaveType.description);
    console.log('form-value', this.form);
  }

  mapFormDataToObj() {
    var leavetypeId: any = this.leaveTypes.at(-1)?.leaveTypeId;
    this.leaveType.leaveTypeId = leavetypeId + 1;
    this.leaveType.leaveTypeName = this.form.controls['leaveTypeName'].value;
    this.leaveType.max_limit = this.form.controls['maxLimit'].value;
    this.leaveType.description = this.form.controls['description'].value;
  }
  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    if (this.form.value !== null && this.form.value != undefined) {

      this.mapFormDataToObj();
      this.service.addLeaveType(this.leaveType).subscribe(obs => {
        if (obs) {
          Swal.fire(
            'Good job!',
            'Leave Type added successfully',
            'success'
          ).then(res => {
            this.onReset();
            this.router.navigateByUrl('/leave-type-report');
          });
        }
        else {
          Swal.fire(
            'Error',
            'Error on Add leave type',
            'error'
          )
        }
      })

      console.log('submit', this.form, this.leaveType);
    }
  }

  onReset() {
    this.submitted = false;
    this.form.reset();
    this.clearData();
  }

  clearData() {
    this.leaveType.leaveTypeId = 0;
    this.leaveType.description = '';
    this.leaveType.max_limit = 0;
    this.leaveType.leaveTypeName = '';
  }

  ngOnDestroy() {
   // this.editTypeSubscription && this.editTypeSubscription.unsubscribe();
  }

}
