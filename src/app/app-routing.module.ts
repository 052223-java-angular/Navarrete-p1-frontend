import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { BrowseComponent } from './pages/browse/browse.component';
import { AuthGuard } from './services/auth/auth-guard.service';
import { MovieComponent } from './pages/movie/movie.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'browse',
    component: BrowseComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'browse',
    children: [{ path: 'movie/:id', component: MovieComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
