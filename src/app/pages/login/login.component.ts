import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginObj: loginObject;
  isLoggingIn: boolean;
  showPassword: boolean;

  constructor(private router: Router, private toastr: ToastrService) {
    this.loginObj = new loginObject();
    this.isLoggingIn = false;
    this.showPassword = false;
  }

  ngOnInit(): void {
  }

  onLogIn(loginFrm: NgForm) {
    if (loginFrm.valid) {
      if (this.loginObj.userName == "admin" && this.loginObj.password == "admin@123") {
        this.isLoggingIn = true;
        setTimeout(() => {
          localStorage.setItem('username', this.loginObj.userName);
          this.toastr.success('Logged In Successfully');
          this.isLoggingIn = false;
          this.router.navigateByUrl('contacts');
        }, 500);
      } else {
        this.toastr.error('Wrong Login Credentials!!');
      }
    } else {
      Object.values(loginFrm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  onEyeClick() {
    this.showPassword = !this.showPassword;
  }

}

export class loginObject {
  userName: string;
  password: string;

  constructor() {
    this.userName = '';
    this.password = '';
  }
};
