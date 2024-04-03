import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiConfig } from "../api-config";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  constructor(private http: HttpClient,
              private router: Router) {}

  signUp(signUpData: any) {
    return this.http.post<any>(apiConfig.signUp, signUpData);
  }

  login(loginData: any) {
    this.http.post<any>(apiConfig.login, { email: loginData.email, password: loginData.password })
      .subscribe(response => {
        if (response) {
          console.log(response);
        }
      });
  }
}
