import { NgModule } from '@angular/core';
import { CommonModule ,DatePipe} from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepicker ,NgbTimepicker} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { SharedRoutingModule } from './shared-routing.module';
import { SharedComponent } from './components/shared/shared.component';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import {HttpClientModule} from '@angular/common/http';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


@NgModule({
  declarations: [
    SharedComponent,
    HeaderComponent,
    SideNavComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    DatePipe,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    NgbModule,
    NgbDatepicker ,
    NgbTimepicker,
    NgxPaginationModule,
    NgbDatepickerModule,
    SharedRoutingModule,
    NgMultiSelectDropDownModule.forRoot(),
    Ng2SearchPipeModule,
  ],
  exports:[
    BrowserModule,
    FormsModule,
    CommonModule,
    DatePipe,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    NgbDatepicker ,
    NgbTimepicker,
    NgxPaginationModule,
    NgbDatepickerModule,
    SharedRoutingModule,
    NgMultiSelectDropDownModule,
    HeaderComponent,
    Ng2SearchPipeModule
  ]
})
export class SharedModule { }
