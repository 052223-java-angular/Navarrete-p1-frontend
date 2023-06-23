import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from 'src/app/models/auth/auth';

import { LoginUserReq } from 'src/app/models/auth/login';

import { AuthService } from 'src/app/services/auth/auth.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  user: LoginUserReq = {
    username: '',
    password: '',
  };
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toaster: ToasterService
  ) {}

  onSubmit(form: NgForm) {
    // don't submit when form is invalid
    if (form.invalid) {
      return;
    }

    // show loading component
    this.isLoading = true;

    // set user values
    this.user.username = form.value.username;
    this.user.password = form.value.password;

    // make request
    this.authService.login(this.user).subscribe({
      next: (resData: Auth) => {
        // set local storage
        localStorage.setItem('user', JSON.stringify(resData));
        // render success toaster
        this.toaster.success('You have successfully logged in.');
        // navigate to login page
        this.router.navigate(['../browse']);
        // remove loading
        this.isLoading = false;
      },
      error: (errorRes) => {
        delete errorRes.error['timestamp'];
        // render error toaster
        this.toaster.error(errorRes.error);
        // remove loading
        this.isLoading = false;
        console.log(errorRes.error);
      },
    });

    // reset form
    form.reset();
  }
}
