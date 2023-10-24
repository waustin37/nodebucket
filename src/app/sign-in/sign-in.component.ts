/**
 * Title: sign-in.component.ts
 * Author: William Austin
 * Date: 23 September 2023
 * Description: Sign-In Component for GPA Calculator
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { SignInService } from '../sign-in.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  signInForm : FormGroup;
  errorMessage: string;

  constructor(private router: Router, private cookieService: CookieService, private fb: FormBuilder, private signInService: SignInService){
  }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      employeeId: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])]
    })
  }

  get form(){
    return this.signInForm.controls;
  }

  onSubmit(){
    const formValues = this.signInForm.value;
    const employeeId = parseInt(formValues.employeeId);

    if(this.signInService.validate(employeeId)){
      this.cookieService.set('session_user', employeeId.toString(), 1);
      this.router.navigate(['/session/tasks'])
    } else {
      this.errorMessage = 'The Employee ID you entered is invalid, please try again.';
    }
  }
}
