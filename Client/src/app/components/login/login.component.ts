import { Component } from '@angular/core';
import { Router } from "@angular/router";
import {AuthService } from "../../services/auth.service";
import {SiteService} from "../../services/site.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData: { email: string, password: string } = { email: '', password: '' };

  constructor(private router: Router,
              private authService:AuthService,
              private siteService:SiteService) { }

  login() {
    this.authService.login(this.loginData);
  }

}
