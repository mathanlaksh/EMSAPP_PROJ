import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule ,ReactiveFormsModule } from '@angular/forms';  
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../api.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent  implements OnInit {
  sideNavStatus:boolean = true;
  confirmPwd:string ='';
  userData:User={
    id:0,
    userName:'', 
    password:'',
    userRole:'',
    emailId:'',
    isActive:false
  }
  users: User[] = [];
  
  constructor(private toastr:ToastrService,
     private apiService: ApiService) {
   this.getallUsers();
  };
  ngOnInit(): void {
   this.clearUserData();
  }
  
  // onChangeRole(e: any) {
  //   this.userData.userRole = e.target.value;
  // }
  onPasswordChange(){
    if(this.userData.password != null && this.confirmPwd!=null){
      if(this.confirmPwd.toLowerCase() != this.userData.password.toLowerCase()){
  this.toastr.warning("Password does not Match!...","INFO");
      }
    }
  }
  clearUserData(){
    this.userData.userName='';
    this.userData.emailId='';
    this.userData.password='';
    this.userData.userRole='';
    this.userData.isActive=false;
    this.confirmPwd = '';
  }
  addUser(){
    this.userData.id = this.users.length+1;
    this.apiService.addUserData(this.userData).subscribe({
      next: (employee) =>{
        this.toastr.success('User Added Successfully', 'User Addition');
        this.clearUserData();
      },
      error: (response)=>{
        alert(response);
      }
    });
    console.log('result', this.userData);
      }

      getallUsers(){
  
        this.apiService.getAllUsers().subscribe({
          next: (users) =>{
            this.users = users;           
           
          },
          error: (response)=>{
            console.log('error',response);
          }
        });
        }
  
  }