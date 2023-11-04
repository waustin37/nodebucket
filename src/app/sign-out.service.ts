/**
 * Title: sign-out .service.ts
 * Author: William Austin
 * Date: 03 November 2023
 * Description: Sign Out Service for NodeBucket
 */

import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SignOutService {
  constructor(private cookieService: CookieService) {}

  signOut() {
    // Remove the "session_user" cookie or perform other sign-out actions
    this.cookieService.delete('session_user');
  }
}

