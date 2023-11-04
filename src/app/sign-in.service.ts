/**
 * Title: sign-in.service.ts
 * Author: William Austin
 * Date: 23 September 2023
 * Description: Sign In Service for GPA Calculator
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SignInService {
  employeeIds: Array<string> = [ '1007', '1008', '1009', '1010', '1011', '1012'];
  employee: any; // Define the employee variable to store fetched employee data

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  async findEmployeeById(employeeId: string): Promise<void> {
    const response = await fetch(`http://localhost:3000/api/employees/${employeeId}`)
    const employee = await response.json()

    this.cookieService.set('session_user', employeeId.toString(), 1);
    this.cookieService.set('name', employee.firstName);

    this.employee = employee; // Set the fetched employee data into the service variable
  }

  validateEmployee(employeeId: string): boolean {
    return this.employeeIds.includes(employeeId);
  }
}

