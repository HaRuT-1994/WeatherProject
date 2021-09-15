import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from 'rxjs/operators';
import { User } from "./user.model";

interface AuthResponseData {
  kind: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  idToken?: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<User>(null)
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAG8zk5xoy_TJezgwqY855axY3Bx8u03ps`, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(
        catchError(this.handleError),
        tap(resData => {
         this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        })
      )
  }

  signIn (email: string, password: string) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAG8zk5xoy_TJezgwqY855axY3Bx8u03ps`, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
       })
      )
  }

  logOut() {
    this.user.next(null);
    this.router.navigate(['/sign-in']);
    localStorage.removeItem('authData');

    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogIn() {
    const userData: {
      email: string; id: string; _token: string; _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('authData'));
    if(!userData) return;

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate))

      if(loadedUser.token) {
        this.user.next(loadedUser);
        const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.autoLogOut(expirationDuration);
      }
  }

  autoLogOut(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logOut();
    }, expirationDuration)
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn*1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogOut(expiresIn * 1000);
    localStorage.setItem('authData', JSON.stringify(user))
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errMessage = 'An unknown error occured!';
    if(!errorRes.error || !errorRes.error.error) {
      return throwError(errMessage);
    }

    switch(errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errMessage = 'The email address is already in use by another account.';
        break;
      case 'OPERATION_NOT_ALLOWED':
        errMessage = 'Password sign-in is disabled for this project';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
        break;
      case 'EMAIL_NOT_FOUND':
        errMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
        break;
      case 'INVALID_PASSWORD':
        errMessage = 'The password is invalid or the user does not have a password.';
        break;
      case 'USER_DISABLED':
        errMessage = 'The user account has been disabled by an administrator.';
        break;
    }
    return throwError(errMessage);
  }
}
