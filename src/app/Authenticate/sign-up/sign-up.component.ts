import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, NgForm, ValidationErrors, Validators, FormControl, FormGroupDirective } from '@angular/forms';
import { AuthService } from '../auth.service';
import {ErrorStateMatcher} from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return (control && control.invalid);
  }
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  public signupForm: FormGroup;
  public isLoginMode: boolean = false;
  public isLoading: boolean = false;
  public error: string = null;
  matcher = new MyErrorStateMatcher();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
    ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    {validators: this.checkPasswords})
  }

  ngOnInit(): void {
  }

  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value;

    return pass === confirmPass ? null : { notSame: true };
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if(!this.signupForm.valid) {
      return;
    }
    if(this.isLoginMode) {

      //...
    } else {
      const email = this.signupForm.value.email;
      const password = this.signupForm.value.password;
      this.isLoading = true;
      this.authService.signUp(email, password)
      .subscribe(resData => {
        console.log(resData);
        this.isLoading = false;
      }, errMessage => {
        this.error = errMessage;
        this.isLoading = false;
      }
      )
    }

    this.signupForm.reset();
  }

  mailErrorMessage() {
    if (this.signupForm.controls['email'].hasError('required')) {
      return 'You must enter an email adrress';
    }

    this.error = null;
    return this.signupForm.controls['email'].hasError('email') ? 'Not a valid email' : '';
  }

  passwordErrorMessage() {
    if (this.signupForm.controls['password'].hasError('required')) {
      return 'You must enter a password';
    }

    return this.signupForm.controls['password'].hasError('minlength') ? 'password length must be greater than 6': '';
  }

  confirmPasswordErrorMessage() {
    console.log(this.signupForm.errors?.notSame)

    if(this.signupForm.errors?.notSame) {
      return  'Password does not match the confirm password';
    }
    // hasError('notSame')
    return '';
  }
}
