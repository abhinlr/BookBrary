import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiConfig } from "../api-config";
import { Router } from "@angular/router";
import { ToastrService} from "ngx-toastr";
import {BehaviorSubject, map, Observable, Subject} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class AuthService{

  private userObject = new BehaviorSubject<any>(null);
  private isAuthenticated = false;

  constructor(private http: HttpClient,
              private router: Router,
              private toastr:ToastrService) {}

  setUserObject(user: any) {
    return this.userObject.next(user);
  }

  getUserObject():Observable<any> {
    return this.userObject.asObservable();
  }

  authUser() {
    let user = localStorage.getItem('user');
    let token = localStorage.getItem('token')
    if(user && token){
      user = JSON.parse(user);
      this.isAuthenticated = true;
      this.setUserObject(user);
    }else{
      this.isAuthenticated = false;
    }
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.isAuthenticated = false;
    location.reload();
  }

  signUp(signUpData: any) {
    return this.http.post<any>(apiConfig.signUp, signUpData);
  }

  login(loginData: any) {
    this.http.post<any>(apiConfig.login, { email: loginData.email, password: loginData.password })
      .pipe(
        map(response => {
          delete response.user.password;
          return response;
        })
      )
      .subscribe(response => {
        if (response.token) {
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          this.isAuthenticated = true;
          this.setUserObject(response.user);
          location.reload();
        }else{
          this.toastr.error('Unable to login','Error');
        }
      });
  }
}
