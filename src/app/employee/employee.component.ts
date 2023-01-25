import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import {Employee} from 'src/app/models/employee.model';
import { ToastrService } from 'ngx-toastr';
import {FormGroup} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { findIndex, toArray,pipe, map, of } from 'rxjs';
import { LeaveApplyComponent } from '../emp-operation/leave-apply/leave-apply.component';
import { outputAst } from '@angular/compiler';
import { LeaveApply } from '../models/leaveApply.model';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class EmployeeComponent implements OnInit {
  //@ts-ignore
 registerForm:FormGroup;
  sideNavStatus:boolean = true;
  displayViewModal="none";
  showAddEditModal: boolean = false;
  showViewModal:boolean = false;

  tempRollNo:string = '';
  employees:any=[];
    
  /*-- filter text --*/
  _filterText: string = '';
  filteredEmployees:Employee[] = [  
  ];
  /*--end-----*/
  max_page:number=6;
  session:any ;

  employeeData:Employee ={
    id:0,
    first_Name:'',
    last_Name:'',
    gender:'',
    dOB:'',
    emp_RollNo:'',
    designation:'',
    skill:'',
    certification:'',
    tot_Exp_In_Yrs:0,
    bio_Brief:'',  
    temp_Addr:'',
    perm_Addr:'',
    email:'',
    phone:'',
    salary:0,
    inc_Percent:0,
    inc_Amt:0
  }

  pagination: number = 1;
  allUsers:number =0;

  
  constructor(private apiService: ApiService,
    private toastr: ToastrService) {
        //  this.refreshPage();
   
    }
  

    ngOnInit(): void { 
      this.getSessionData(); 
      this.getEmployeeData();
    this.clearData();
    }

    getSessionData(){
      if(this.apiService.getUserSession('userKey')){
        var data : any = this.apiService.getUserSession('userKey');
        this.session = JSON.parse(data);
        console.log('getSession',this.session);
        this.getEmployeeData();
      }
    }
    
getEmployeeData(){

    this.employees = [];
  this.apiService.getEmployeeDataByEmail(this.session.emailId).subscribe({
    next: (employees) =>{
      this.employees = employees;
      //this.getEmpData.emit(employees);
     
    //  this.filteredEmployees =this.employees;
     this.generateRollNo();
    },
    error: (response)=>{
      console.log('error',response);
    }
  });
 
  }

 
  
  generateRollNo(){
  var count = this.employees.length +1;
  this.tempRollNo='UAN2200' + count;

  if(this.tempRollNo != null || this.tempRollNo != undefined)
    this.employeeData.emp_RollNo = this.tempRollNo;
  }
    clearData(){      
      this.employeeData.first_Name='';
      this.employeeData.last_Name='';
      this.employeeData.gender='';
      this.employeeData.dOB='',
      this.employeeData.emp_RollNo='';
      this.employeeData.designation='';
      this.employeeData.skill='';
      this.employeeData.certification='';
      this.employeeData.tot_Exp_In_Yrs=0;
      this.employeeData.bio_Brief='';  
      this.employeeData.temp_Addr='';
      this.employeeData.perm_Addr='';
      this.employeeData.email='';
      this.employeeData.phone='';
      this.employeeData.salary=0;
      this.employeeData.inc_Percent=0;
      this.employeeData.inc_Amt=0;
      }
 /*--------------Search Filter Text---------*/   
    get FilterText(){
      return this._filterText;
    }

   set FilterText(value:string){
   this._filterText = value;
   this.filteredEmployees =this.filterEmployeesByName(value);
    }

    filterEmployeesByName(filterTerm:string){
      if (this.employees.length == 0 || this._filterText =='') {
        return this.employees;
            }
             else {
              return this.employees.filter((employee:any) =>{
                var fullName = employee.first_Name + employee.last_Name;
                return  fullName.toLowerCase() == filterTerm.toLowerCase()
              });
            }

    }
     /*--------------Search Filter Text End---------*/   

     /*-----------pagination Code---------*/
     renderPage(event:number){
      this.pagination = event;
      this.getallEmployeesByPage();
    }

    getallEmployeesByPage(){
      this.apiService.getEmployees(this.pagination).subscribe((res:any)=>{
        this.employees = res.data;
        this.allUsers = res.total;
      })
    }
/*-----------pagination Code end--------*/

   
    
   
  /*------------------------modal dialog show and close ------------------*/
  
  onCloseModalAll(){
    this.showViewModal = false;
    const viewRequest = document.getElementById('viewRequestModal');
console.log('modalreq',viewRequest);
   
    if(viewRequest != null ){
      viewRequest.style.display = "none";
      this.displayViewModal = "none";
      console.log('closeModal-view',viewRequest, viewRequest.style.display,this.displayViewModal) ;

    }
  }
 
  onViewRequest(emp:Employee){
    this.showViewModal = true;
    this.displayViewModal= "block";
    console.log('showViewModal_Befor_hit',this.displayViewModal)  ;
    //console.log('after click view ',this.getEmpData);

    const notNull = document.getElementById('viewRequestModal');
    if(notNull != null){
      notNull.style.display = "block";
      console.log('showViewModal_after_hit',notNull,notNull.style.display,this.displayViewModal)  ;

    }
    this.employeeData = emp;
  }
  /*------------------------modal dialog show and close end------------------*/
 
 
/*-----------------------Database CRUD OPERATIONS CODE END ------------------------*/
// page = 1;
// pageSize = 4;
// collectionSize = this.employees.length;
  
/*refreshPage() {
  this.employees
  .map((emp, i) => ({id: i + 1, ...emp}))
  .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
}*/

}
