import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth/auth.service';

import { registerUserReq } from 'src/app/models/auth';
import { ToasterService } from 'src/app/services/toaster/toaster.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  user: registerUserReq = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  emailRegEx = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$');
  passwordRegEx = new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&+=])(?=\\S+$).{0,}$');
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toaster: ToasterService
  ) {}

  /* ----------------- Life cycle methods --------------------- */

  ngOnInit() {}

  /* ---------------------- Methods --------------------------- */

  onSubmit(form: NgForm) {
    // don't submit when form is invalid
    if (form.invalid) {
      return;
    }

    // show loading component
    this.isLoading = true;

    // set user values
    this.user.username = form.value.username;
    this.user.email = form.value.email;
    this.user.password = form.value.password;
    this.user.confirmPassword = form.value.confirmPassword;

    // make request
    this.authService.signup(this.user).subscribe({
      next: () => {
        // render success toaster
        this.toaster.success('You have successfully registerd.');
        // navigate to login page
        this.router.navigate(['../login']);
        // remove loading
        this.isLoading = false;
      },
      error: (error) => {
        delete error.error['timestamp'];
        // render error toaster
        this.toaster.error(error.error);
        // remove loading
        this.isLoading = false;
      },
    });

    // reset form
    form.reset();
  }
}
