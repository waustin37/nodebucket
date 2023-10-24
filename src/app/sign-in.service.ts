/**
 * Title: sign-in.service.ts
 * Author: William Austin
 * Date: 23 September 2023
 * Description: Sign In Service for GPA Calculator
 */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  employeeIds: Array<number>;

  constructor() {
    this.employeeIds = [1007, 1008, 1009, 1010, 1011, 1012];
   }

   validate(employeeId: number) {
    return this.employeeIds.some(id => id === employeeId);
   }
}