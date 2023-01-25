import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Employee } from 'src/app/models/employee.model';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
@Component({
  selector: 'app-employee-admin',
  templateUrl: './employee-admin.component.html',
  styleUrls: ['./employee-admin.component.css']
})
export class EmployeeAdminComponent implements OnInit {
  //@ts-ignore
  registerForm: FormGroup;
  sideNavStatus: boolean = true;
  userRole: string = "";
  displayAddEditModal = "none";
  displayViewModal = "none";

  showAddEditModal: boolean = false;
  showViewModal: boolean = false;
  isEditModalBtn: boolean = false;
  isAddModalBtn: boolean = false;
  isBtnSubmit: boolean = false;

  tempRollNo: string = '';
  employees: Employee[] = [];
  /*-- filter text --*/
  enteredSearchValue: string = '';
  _filterText: string = '';
  filteredEmployees: Employee[] = [];
  /*--end-----*/
  max_page: number = 6;
  session: any;
  pagination: number = 1;
  allUsers: number = 0;
  tempCountRollNo: number=0;
  selectedFile: File | null = null;
  employeeData: Employee = {
    id: 0,
    first_Name: '',
    last_Name: '',
    gender: '',
    dOB: '',
    emp_RollNo: '',
    designation: '',
    skill: '',
    certification: '',
    tot_Exp_In_Yrs: 0,
    bio_Brief: '',
    temp_Addr: '',
    perm_Addr: '',
    email: '',
    phone: '',
    salary: 0,
    inc_Percent: 0,
    inc_Amt: 0,
    profilePhoto: null
  }


  constructor(private apiService: ApiService,
    private toastr: ToastrService, private fb: FormBuilder, private calendar: NgbCalendar) {
    //  this.refreshPage();

  }

  ngOnInit() {
    //this.createRegisterForm();
    this.getSessionData();
    this.getallEmployees();
    this.clearData();
    this.generateRollNo();
  }
  onSearchTextChanged() {

  }


  /*-----------pagination Code---------*/
  renderPage(event: number) {
    this.pagination = event;
    this.getallEmployeesByPage();
  }

  getallEmployeesByPage() {
    this.apiService.getEmployees(this.pagination).subscribe((res: any) => {
      this.employees = res.data;
      this.allUsers = res.total;
    })
  }
  /*-----------pagination Code---------*/
  clearData() {
    this.employeeData.first_Name = '';
    this.employeeData.last_Name = '';
    this.employeeData.gender = '';
    this.employeeData.dOB = '';
    this.employeeData.emp_RollNo = '';
    this.employeeData.designation = '';
    this.employeeData.skill = '';
    const arr = 'helloworld';
    this.employeeData.certification = '';
    this.employeeData.tot_Exp_In_Yrs = 0;
    this.employeeData.bio_Brief = '';
    this.employeeData.temp_Addr = '';
    this.employeeData.perm_Addr = '';
    this.employeeData.email = '';
    this.employeeData.phone = '';
    this.employeeData.salary = 0;
    this.employeeData.inc_Percent = 0;
    this.employeeData.inc_Amt = 0;
    this.employeeData.profilePhoto = null;
  }

  getSessionData() {
    if (this.apiService.getUserSession('userKey')) {
      var data: any = this.apiService.getUserSession('userKey');
      this.session = JSON.parse(data);
      this.userRole = this.session.userRole == 'Admin' ? 'Admin' : 'HR'
    }
  }


  getallEmployees() {

    this.apiService.getAllEmployeeData().subscribe({
      next: (employees) => {
        this.employees = employees;

        this.filteredEmployees = this.employees;
      },
      error: (response) => {
        console.log('error', response);
      }
    });
  }



  generateRollNo() {
    this.tempRollNo = '';
    let count: any =this.employees.at(-1)?.id;
    this.tempCountRollNo = count + 1;
    console.log('count var', this.tempCountRollNo);
    this.tempRollNo = 'UAN2200' + this.tempCountRollNo;

    if (this.tempRollNo != null || this.tempRollNo != undefined)
      this.employeeData.emp_RollNo = this.tempRollNo;
  }

  /*------------------------modal dialog show and close ------------------*/
  onShowAddModal() {
    this.showAddEditModal = true;
    this.isEditModalBtn = false;;
    this.isAddModalBtn = true;
    this.displayAddEditModal = 'block';
    console.log('emp-dob', this.employeeData.dOB);
    this.generateRollNo();
    this.clearData();
  }
  onShowEditModal() {
    this.showAddEditModal = true;
    this.isEditModalBtn = true;
    this.isAddModalBtn = false;
    this.tempRollNo = '';
    this.displayAddEditModal = 'block';
    console.log('showeditModal', document.getElementById('addEditRequestModal'), this.displayAddEditModal);
  }
  onShowViewModal() {
    this.showViewModal = true;
    this.displayViewModal = 'block';
  }

  onCloseModalAll() {
    if (this.showAddEditModal == true) {
      this.displayAddEditModal = 'none';
      this.showAddEditModal = false;
      this.isEditModalBtn = false;
      this.isAddModalBtn = false;
    }
    if (this.showViewModal == true) {
      this.displayViewModal = 'none';
      this.showViewModal = false;
    }

  }
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile =<File>event.target.files[0];
      console.log('this.selectedfile , event value', this.selectedFile, event);

    }

  }
  onUpload() {
    if ((this.selectedFile?.type == 'image/png' || this.selectedFile?.type == 'image/jpeg')) {
      const formData = new FormData();
      this.employeeData.profilePhoto = this.selectedFile;
      formData.append('image', this.selectedFile, this.selectedFile.name);
      console.log('profilePhoto,formData', this.employeeData,formData);
      Swal.fire('File Upload Info !', 'You have selected image will upload when give submit ', 'info');
    }
    else {
      Swal.fire('Invalid File Format', 'Please select jpeg or png format file', 'error');
    }

  }
  onEditRequest(user: Employee) {
    this.onShowEditModal();
    this.employeeData = user;
    console.log('user', user);
  }

  onViewRequest(emp: Employee) {
    this.onShowViewModal();
    this.employeeData = emp;
  }

  onDeleteRequest(emp: Employee) {
    this.employeeData = emp;
    Swal.fire({
      title: 'Are you Sure?',
      text: 'You want to delete' + emp.first_Name + ' ' + emp.last_Name + ' data',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Yes Delete it!',
      cancelButtonText: 'No Cancel !',
      reverseButtons: true
    }).then(promise => {
      if (promise.isConfirmed) {
        this.deleteEmployeeData();
      }
    })

  }
  /*------------------------modal dialog show and close end------------------*/
  onCheckboxChange(e: any) {
    if (e.target.checked) {
      this.employeeData.perm_Addr = this.employeeData.temp_Addr;
    }
    else {
      this.employeeData.perm_Addr = '';
    }
  }
  onchangeCalcInc() {
    if (this.employeeData.inc_Percent != 0 && this.employeeData.salary != 0) {
      this.employeeData.inc_Amt = this.employeeData.inc_Percent / 100 * this.employeeData.salary;
    }
    else {
      this.toastr.info('Increment or Salary field cannot be zero', 'Info')
    }
  }

  /*-----------------------Database CRUD OPERATIONS CODE ------------------------*/
  addEmployee() {
    this.isBtnSubmit = true;
    if (this.isBtnSubmit == true) {
      this.employeeData.id = this.employees.length + 1;
      // this.employeeData.dOB =  this.date;
      debugger
      this.apiService.addEmployeeData(this.employeeData).subscribe({
        next: (employee) => {
          console.log('addemployee', employee);
          this.toastr.success('Employee Added Successfully', 'Employee Addition');
          this.getallEmployees();
          this.onCloseModalAll();
          this.clearData();
        },
        error: (response) => {
          console.log('error', response);
        }
      });
    }
  }

  updateEmployee(employeeData: Employee): any {
    this.apiService.updateEmployeeData(this.employeeData.id, this.employeeData).subscribe({
      next: (employee) => {
        this.toastr.success('Employee Data Updated Successfully', 'Manage Details');
        console.log('employee', employee);
        this.onCloseModalAll();
        this.getallEmployees();
        this.clearData();
      },
      error: (response) => {
        console.log('error', response);
      }
    });
  }

  deleteEmployeeData() {
    this.apiService.deleteEmployeeData(this.employeeData.id).subscribe({
      next: (employee) => {
        this.getallEmployees();
        Swal.mixin({
          toast: true,
          icon: 'success',
          title: 'Mr.  ' + this.employeeData.first_Name + 'Record Deleted',
          position: 'top-right',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter',
              Swal.stopTimer)
            toast.addEventListener('mouseleave',
              Swal.resumeTimer)
          }
        });
      },
      error: (response) => {
        console.log('error', response);
      }
    });
  }
  /*-----------------------Database CRUD OPERATIONS CODE END ------------------------*/
  page = 1;
  pageSize = 4;
  collectionSize = this.employees.length;

  // refreshPage() {
  //   this.employees
  //   .map((emp, i) => ({id: i + 1, ...emp}))
  //   .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  // }

}
