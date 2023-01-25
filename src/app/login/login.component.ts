import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  @Output() login = new EventEmitter<User>();
  
  
  
  users: User[] = [];
  session: any;
  loginObj: User = {
    id: 0,
    userName: '',
    password: '',
    emailId: '',
    userRole: '',
    isActive: false
  }


  public loginForm!: FormGroup;
  constructor(private router: Router, private fb: FormBuilder, private service: ApiService,
    private toastr: ToastrService) {
    this.getAllUsers();
  }

  ngOnInit(): void {
    // this.loginForm = this.fb.group({
    // userName:["",Validators.compose([Validators.required,Validators.email])],
    // password:["",Validators.required]
    // });
  }

  onLogin() {

    if ((this.loginObj.emailId != null || this.loginObj.emailId != "" || this.loginObj.emailId != undefined)
      && (this.loginObj.password != null || this.loginObj.password != "" || this.loginObj.password != undefined)) {
      var userLogin = this.users.find(i => 
        i.emailId == this.loginObj.emailId && i.password == this.loginObj.password
        && i.userRole.toLowerCase() == this.loginObj.userRole.toLowerCase())
        console.log('userLogin', userLogin);
      if (userLogin != null || userLogin != undefined) {
        this.service.setUserSession('userKey', JSON.stringify(userLogin));
        //--- navigate url by session value start 

        this.getSessionData();
        console.log('session', this.session);
        if (this.session != null && this.session.userRole == 'Admin') {
          this.login.emit(this.loginObj);
          this.router.navigateByUrl("admin-dashboard");
        }
        else if (this.session != null && this.session.userRole == 'Employee') {
          this.router.navigateByUrl("employee-dashboard");
        }
      }
      else {
        this.toastr.error("user record not match ! please try again or signup", "LoginError ?");
        // this.router.navigateByUrl("signUp");
      }
    }
    //--- navigate url by session value end 
  }
  getSessionData() {
    if (this.service.getUserSession('userKey')) {
      var data: any = this.service.getUserSession('userKey');
      this.session = JSON.parse(data);
    }
  }

  getAllUsers() {
    this.service.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (response) => {
        alert("Error : " + response);
      }

    })
  }

  onReset() {
    this.loginObj.id = 0;
    this.loginObj.userName = '';
    this.loginObj.password = '';
    this.loginObj.userRole = '';
    this.loginObj.emailId = '';
    this.loginObj.isActive = false;

  }

  onBack() {
    if (confirm('Are you sure you want to goto Sign Up page ?')) {
      this.router.navigateByUrl('signUp');
    }
  }
}
