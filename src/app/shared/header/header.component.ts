import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/Authenticate/auth.service';
import { Router, Event as NavigationEvent, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  public isAuth = false;
  url: boolean = false;

  constructor(private authService: AuthService, private router: Router) {  }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(
      user => {
        this.isAuth = !!user;
      }
    )

   this.router.events
   .subscribe(
    (event: NavigationEvent) => {
      if(event instanceof NavigationEnd) {

       this.url = event.url === '/weather' ? true : false;
      }
    });
  }

  onLogout() {
    this.authService.logOut();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
