import { Injectable } from "@angular/core";
import { CanLoad, Route, UrlTree, UrlSegment, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from "./auth.service";

@Injectable({providedIn: 'root'})
  export class LoadGuard implements CanLoad {

    constructor(private authService: AuthService, private router: Router) {}

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.user.pipe(
        map(user => {
          if(!!user) {
            return !!user;
          }

          return this.router.createUrlTree(['/sign-in']);
        })
      );
    }
}

