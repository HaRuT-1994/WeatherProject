import { Component, OnInit } from '@angular/core';
import { AuthService } from './Authenticate/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Weather';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.autoLogIn();
  }
}
