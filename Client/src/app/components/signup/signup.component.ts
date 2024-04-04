import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import { ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  constructor(private authService: AuthService,
              private router: Router,
              private toastr:ToastrService) {
  }

  signUpData: { name: String, email: String, password: String} = {
    name: '',
    email: '',
    password: '',
  };

  signup() {
    this.authService.signUp(this.signUpData)
      .subscribe(response => {
        if (response.success) {
          this.toastr.success('Signed up successfully','Success');
          location.reload();
        }else{
          this.toastr.error('Email already exists','Error');
        }
      });
  };
}
