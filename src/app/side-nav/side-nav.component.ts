import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent {
  @Input() sideNavStatus : boolean = false;

  list = [
    {
      number: '1',
      name: 'Home',
      icon: 'fa fa-solid fa-home',
      path:'signUp'
    },
    {
      number: '2',
      name: 'Employees',
      icon: 'fa fa-user',
      path:'employees'
    },
    {
      number: '3',
      name: 'Login',
      icon: 'fa fa-male',
      path:'login'
    },
    {
      number: '4',
      name: 'Contact Us',
      icon: 'fa fa-solid fa-phone',
      path:'employees'
    }
  ];
  
  constructor(){
  
   }
   ngOnInit(): void{
    
   }
}
