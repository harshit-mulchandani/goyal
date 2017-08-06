import { Injectable } from '@angular/core';
import {Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { CanActivate } from '@angular/router';
// Import our authentication service
import { AuthService } from './auth.service';
import {Observable} from "rxjs";

@Injectable()
export class AuthGuardService implements CanActivate{

  constructor(private _authService: AuthService, private router: Router) {}

  canActivate(){
    // If the user is not logged in we'll send them back to the home page
      if(localStorage.getItem('auth_user') == null){
        this.router.navigateByUrl("");
        return false;
      }else{
         return true;

      }



  }


}
