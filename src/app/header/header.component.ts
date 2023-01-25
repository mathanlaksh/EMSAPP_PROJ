import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() sideNavToggled = new EventEmitter<boolean>();
  menuStatus: boolean  =false;
  session:any ;
  WelcomeMsg:any = null;


    constructor(private service: ApiService, private router: Router) {
      this.getSessionData();

    }
    sideNavToggle(){
  this.menuStatus = !this.menuStatus;
  this.sideNavToggled.emit(this.menuStatus);
    }
  ngOnInit(): void {
  }

  getSessionData(){
    if(this.service.getUserSession('userKey')){
      var data : any = this.service.getUserSession('userKey');
      this.session = JSON.parse(data);
      this.WelcomeMsg = "Welcome the " + this.session.userRole + " "+ this.session.userName;
    }

  }
  
  onLogOut(){
 this.service.removeUserSession(this.session);
 this.session =null;
 this.WelcomeMsg = null;
//  this.router.navigateByUrl('signUp')
//  console.log('close session',this.session);
  }
}
