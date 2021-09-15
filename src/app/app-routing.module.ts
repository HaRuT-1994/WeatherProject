import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadGuard } from './Authenticate/auth-load.guard';
import { AuthComponent } from './Authenticate/auth.component';
import { AuthGuard } from './Authenticate/auth.guard';
import { SignInComponent } from './Authenticate/sign-in/sign-in.component'
import { SignUpComponent } from './Authenticate/sign-up/sign-up.component'

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,

    children: [
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      {
        path: 'sign-in', component: SignInComponent
      },
      {
        path: 'sign-up', component: SignUpComponent
      }
    ],
  },
  {
    path: 'weather',
    canLoad: [LoadGuard],
    loadChildren: () => import('./weather/weather.module').then(m => m.WeatherModule),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'auth' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
