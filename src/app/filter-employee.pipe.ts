import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'rxjs';
import { Employee } from './models/employee.model';

@Pipe({
  name: 'filterEmployee'
})
export class FilterEmployeePipe implements PipeTransform {
 
  transform(employees: Employee[], filterText: string) {
    if (employees.length == 0 || filterText =='') {
return employees;
    } 
     else {
      return employees.filter((employee) =>{
        return employee.first_Name.toLowerCase() == filterText.toLowerCase()
      });
    }
    }

}
