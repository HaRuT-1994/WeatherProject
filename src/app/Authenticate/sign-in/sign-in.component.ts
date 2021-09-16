import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, NgForm, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['../signin-signup.component.scss']
})
export class SignInComponent implements OnInit {
  public signinForm: FormGroup;
  public isLoginMode: boolean = false;
  public isLoading: boolean = false;

  ngOnInit(): void {
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
    ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  onSubmit() {
    if(!this.signinForm) {
      return;
    }
    if(this.isLoginMode) {

      //...
    } else {
      const email = this.signinForm.value.email;
      const password = this.signinForm.value.password;
      this.isLoading = true;
      this.authService.signIn(email, password)
      .subscribe(
        () => {
          this.isLoading = false;
          this.router.navigate(['/weather']);
        },
        error => {
          console.log(error);
          this.isLoading = false;
        }
      )
    }

    this.signinForm.reset();
  }

  mailErrorMessage() {
    if (this.signinForm.controls['email'].hasError('required')) {
      return 'You must enter an email adrress';
    }

    return this.signinForm.controls['email'].hasError('email') ? 'Not a valid email' : '';
  }

  passwordErrorMessage() {
    if (this.signinForm.controls['password'].hasError('required')) {
      return 'You must enter a password';
    }

    return this.signinForm.controls['password'].hasError('minlength') ? 'password length must be greater than 6': '';
  }
}
