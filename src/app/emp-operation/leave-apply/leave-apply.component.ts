import { EventEmitter } from '@angular/core';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, takeUntil } from 'rxjs';
import { interval, Subscription } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { Holiday } from 'src/app/models/holiday.model';
import { LeaveApply } from 'src/app/models/leaveApply.model';
import { LeaveType } from 'src/app/models/leaveType.model';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { LeaveDetailsComponent } from '../leave-details/leave-details.component';

@Component({
  selector: 'app-leave-apply',
  templateUrl: './leave-apply.component.html',
  styleUrls: ['./leave-apply.component.css']
})
export class LeaveApplyComponent implements OnInit, AfterViewInit, OnDestroy {
  //@Output() sendLeaveData: EventEmitter<LeaveApply> = new EventEmitter<LeaveApply>();
  data: any;
  leaveTypes: LeaveType[] = [];
  holidayList: Holiday[] = [];
  leaveDetails: LeaveApply[] = [];
  leaveApply: LeaveApply = {
    leaveId: 0,
    empId: 0,
    fromDate: '',
    toDate: '',
    leaveTypeId: 0,
    status: '',
    remarks: '',
    no_of_leave_taken: 0,
    no_of_availedLeave: 0,
    max_limit: 0,
    leaveType: '',
    isHalfDay:false,
    isHalfDayValue:'',
    lv_approver: []
  }
  submitted: boolean = false;
  session: any;
  categoryId: any = null;
  leaveId: number = 0;
  leaveToDisplay: any;
  private sub: any;
  constructor(private router: Router,
    private service: ApiService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private dataService: SharedDataService,
    private route: ActivatedRoute) {

  }

  form: FormGroup = new FormGroup({
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
    category: new FormControl(''),
    remarks: new FormControl(''),
    isHalfDay: new FormControl(''),    
    isHalfDayValue: new FormControl(''),    
  });



  getFromDate(e: any) {
    this.leaveApply.fromDate = new Date(e.target.value).toISOString();

    this.checkAnyHoliday();
    if ((new Date(this.leaveApply.fromDate).getTime() != new Date().getTime()) && new Date(this.leaveApply.fromDate).getTime() < new Date().getTime()) {
      this.toast.error('from Date cannot be past !', 'Past Date Chosen!');
    }
    if (this.leaveApply.toDate != undefined && this.leaveApply.toDate != null && new Date(this.leaveApply.fromDate).getTime() > new Date(this.leaveApply.toDate).getTime()) {
      this.toast.warning('from Date cannot be greater than to date !', 'Date Chosen!');
    }
    const duplicateDate = this.leaveDetails
      .filter(i => new Date(i.fromDate).getTime() == new Date(this.leaveApply.fromDate).getTime() && i.status.toLowerCase() !== 'completed' && i.status.toLowerCase() !== 'rejected' && i.status.toLowerCase() !== 'cancelled')
    if (this.leaveApply.fromDate != undefined && this.leaveApply.fromDate != null && duplicateDate.length > 0) {
      this.toast.error('You already applied on same date !', 'Duplicate Date Chosen!');
    }
  }

  getToDate(e: any) {
    this.leaveApply.toDate = e.target.value;
    this.checkAnyHoliday();
    if ((new Date(this.leaveApply.toDate).getTime() != new Date().getTime()) && new Date(this.leaveApply.toDate).getTime() < new Date().getTime()) {
      this.toast.error('To Date cannot be past !', 'Past Date Chosen!');
    }
    if (this.leaveApply.fromDate != undefined && this.leaveApply.fromDate != null && new Date(this.leaveApply.toDate).getTime() < new Date(this.leaveApply.fromDate).getTime()) {
      this.toast.error('to Date cannot be smaller than from date !', 'Date Chosen!');
    }
    const duplicateDate = this.leaveDetails
      .filter(i => new Date(i.toDate).getTime() == new Date(this.leaveApply.toDate).getTime() && i.status.toLowerCase() !== 'completed' && i.status.toLowerCase() !== 'rejected' && i.status.toLowerCase() !== 'cancelled')
    if (this.leaveApply.toDate != undefined && duplicateDate.length > 0) {
      this.toast.error('You already applied on same date !', 'Duplicate Date Chosen!');
    }
  }

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

  getHolidayList() {
    this.service.getHolidayList().subscribe({
      next: (res) => {
        this.holidayList = res;
      },
      error: (err) => {
        this.toast.error('error-getting-holidaylist', err);
      }
    })
  }

  getLeaveDetails() {
    this.service.getLeaveDetails().subscribe({
      next: (lists) => {
        this.leaveDetails = lists;
      }, error: (err) => {
      }
    });

  }

  checkAnyHoliday() {
    if ((this.leaveApply.fromDate !== null && this.leaveApply.fromDate !== undefined) ||
      (this.leaveApply.toDate !== null && this.leaveApply.toDate !== undefined)) {
      var isanyHoliday: any = this.holidayList.find((i) => {

        return ((new Date(i.holidayDt)).getTime() === new Date(this.leaveApply.fromDate).getTime())
          || (new Date(i.holidayDt).getTime() === new Date(this.leaveApply.toDate).getTime())
      });
      if (isanyHoliday != null && isanyHoliday !== undefined) {
        this.toast.info('Date which you had provided is on holiday !', 'Holiday !');
      }

    }
  }

  ngOnInit(): void {
    this.getSessionData();
    this.getLeaveType();
    this.getHolidayList();
    this.getLeaveDetails();
    this.form = this.formBuilder.group(
      {
        fromDate: ['', [Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]],
        toDate: ['', [Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]],
        category: [
          '',
          [
            Validators.required

          ],
        ],
        isHalfDay: [''],
        isHalfDayValue:['',[Validators.required]],
        remarks: ['', Validators.required],
      }
    );
    this.form.controls['category'].setValue(-1);        
    this.leaveId = this.route.snapshot.params['leaveId'];
    // this.sub = this.route.queryParams.subscribe(params => {
    //   this.leaveId = params['leaveId'];
    //   console.log('param id', this.leaveId);
    //   if (this.leaveId !== undefined && this.leaveId !== 0) {
    //     this.getLeaveToDisplay(this.leaveId);
    //   }
    // })
  
    this.dataService.passLeaveData().subscribe((obs) => {
      if (obs) {
        this.leaveApply = obs;
        console.log('passdata', this.leaveApply, obs);
        
      }
    });
    console.log('leaveId', this.leaveId);
    if(this.leaveId !== undefined && this.leaveId !=0){
      this.getLeaveToDisplay(this.leaveId);    
    }

  } /*---end of code ngOnInit-----*/

  getLeaveToDisplay(leaveId: number) {
    debugger
    this.service.getLeaveToDisplay(leaveId).subscribe({
      next: data => {
        this.leaveApply = data;
        this.mapFormValue();
        console.log('get data by param', data,this.leaveApply);
      },
      error: err => {
        console.log('something get error');
      }
    }

    )
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  mapFormValue() {
    
    this.form.get('fromDate')?.setValue(this.leaveApply.fromDate);
    this.form.get('toDate')?.setValue(this.leaveApply.toDate);
    this.form.get('category')?.setValue(this.leaveApply.leaveTypeId);
    this.form.get('isHalfDay')?.setValue(this.leaveApply.isHalfDay);
    this.form.get('isHalfDayValue')?.setValue(this.leaveApply.isHalfDayValue);
    this.form.get('remarks')?.setValue(this.leaveApply.remarks);

    
    
    // this.form.setValue({
    //   fromDate: this.leaveApply.fromDate,
    //   toDate: this.leaveApply.toDate,
    //   category: this.leaveApply.leaveTypeId,
    //   remarks: this.leaveApply.remarks
    // }) ;


    // this.form.controls['fromDate'].setValue(new Date(this.leaveApply.fromDate));
    // this.form.controls['toDate'].setValue(new Date(this.leaveApply.toDate));
    // this.form.controls['category'].setValue(this.leaveApply.leaveTypeId);
    // this.form.controls['remarks'].setValue(this.leaveApply.remarks);
    
    console.log('form-group value',this.form.value) 
  }
  changeCategory(event: any) {
    console.log('event-val', event);


    if (this.leaveApply.leaveTypeId == null &&
      this.leaveApply.leaveTypeId == undefined && this.leaveApply.leaveTypeId == -1) {
      this.leaveApply.leaveTypeId = 0;
      this.leaveApply.leaveType = "";
    }

    if (event !== null && event !== undefined) {
      this.leaveApply.leaveTypeId = event;
      this.leaveApply.leaveType = this.leaveTypes.find(i => i.leaveTypeId == this.leaveApply.leaveTypeId)?.leaveTypeName;
    }

    var maxlimit = this.leaveTypes.find(i => i.leaveTypeId == this.leaveApply.leaveTypeId)?.max_limit;
    maxlimit == undefined ? maxlimit = 0 : maxlimit;
    this.leaveApply.max_limit = 1;
    var fromDate = new Date(this.leaveApply.fromDate);
    var toDate = new Date(this.leaveApply.toDate);
    fromDate.setDate(fromDate.getDate());
    var dateDiffInTime = toDate.getTime() - fromDate.getTime();
    var dateDiffInDays = Math.round(dateDiffInTime / (1000 * 3600 * 24)) + 1;
    // var dateDiffInDays = Math.floor((Date.UTC(this.leaveApply.toDate.getFullYear(), this.leaveApply.toDate.getMonth(), this.leaveApply.toDate.getDate()) - Date.UTC(this.leaveApply.fromDate.getFullYear(), this.leaveApply.fromDate.getMonth(), this.leaveApply.fromDate.getDate()) ) /(1000 * 60 * 60 * 24));
    if ((dateDiffInDays > this.leaveApply.max_limit)) {
      this.toast.warning('Leave cannot be exceed more than ' + (this.leaveApply.max_limit) + ' days for ' + this.leaveApply.leaveType);
    }
  }
  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
debugger
    if (this.form.value !== null || this.form.value != undefined) {
      // this.leaveApply = this.form.value;
      this.leaveApply.empId = this.session.id;
      this.leaveApply.leaveId = this.leaveDetails.length + 1;
      this.leaveApply.fromDate = this.form.controls['fromDate'].value;
      this.leaveApply.toDate = this.form.controls['toDate'].value;
      this.leaveApply.status = "Pending";
      this.leaveApply.isHalfDay = this.form.controls['isHalfDay'].value;
      this.leaveApply.isHalfDayValue = this.leaveApply.isHalfDay? this.form.controls['isHalfDayValue'].value : undefined;
      this.leaveApply.remarks = this.form.controls['remarks'].value;
      var taken_lv_count = this.leaveDetails.filter(i => new Date(i.fromDate).getFullYear == new Date().getFullYear && i.status.toLowerCase() == "approved").length;
      this.leaveApply.no_of_leave_taken = taken_lv_count == 0 ? 0 : taken_lv_count;
      this.leaveApply.no_of_availedLeave = this.leaveApply.max_limit - this.leaveApply.no_of_leave_taken; // max leave field need to get value from emp-addition page
      this.service.applyLeave(this.leaveApply).subscribe({
        next: (res) => {
          this.toast.success("you applied leave. waiting for approval!");
          this.router.navigateByUrl('leave-details');
        },
        error: (err) => {
          this.toast.error(err);
        }
      });

    }
  }

  onBacktoPage() {
    this.router. routeReuseStrategy.shouldReuseRoute=()=>false;
    this.router.navigateByUrl('leave-details');
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
    this.form.controls['category'].setValue(-1);
    console.log('fromdt,todt,category', this.form);
  }

  ngAfterViewInit() {   
    this.mapFormValue();

  }
  ngOnDestroy() {
    // this.editRequestSubscription.unsubscribe();
  }
}

