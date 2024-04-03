import {Component, OnDestroy, HostListener} from '@angular/core';
import {Router} from "@angular/router";
import {OnInit} from "@angular/core";
import {Subscription} from "rxjs";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy{

  userIsAuthenticated: boolean = false;

  constructor(private router: Router,
              private authService: AuthService) {
    this.authService.getUserObject().subscribe(value => this.userObject = value);
  }

  loginPopup: boolean = false;
  signUpPopup: boolean = false;
  userObject!:any;
  ngOnInit() {
    if(this.userObject){
      this.userIsAuthenticated = true;
    }
  }

  ngOnDestroy() {
  }

  openLoginPopup(){
    this.loginPopup = true;
  }
  closePopup(){
    this.loginPopup = false;
    this.signUpPopup = false;
  }

  openSignUpPopup(){
    this.signUpPopup = true;
  }

  logout(){
    this.authService.logout();
  }

}
