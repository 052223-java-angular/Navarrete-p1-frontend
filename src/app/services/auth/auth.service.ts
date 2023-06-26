import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { JwtHelperService } from '@auth0/angular-jwt';

import { LoginUserReq } from '../../models/auth/login';
import { RegisterUserReq } from 'src/app/models/auth/register';
import { environment } from 'src/environments/environment.development';
import { Auth } from 'src/app/models/auth/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  /* ---------------- Methods ------------------ */
  register(user: RegisterUserReq): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/register`, user);
  }

  login(user: LoginUserReq): Observable<Auth> {
    return this.http.post<Auth>(`${this.apiUrl}/auth/login`, user);
  }

  isLoggedIn(): boolean {
    return !this.jwtHelper.isTokenExpired(this.getToken());
  }

  getToken(): string {
    return this.extractUserData('token');
  }

  getUserId(): string {
    return this.extractUserData('id');
  }

  getUsername(): string {
    return this.extractUserData('username');
  }

  private extractUserData(target: keyof Auth): string {
    const authString: string | null = localStorage.getItem('user') || null;
    if (typeof authString === 'string') {
      const auth: Auth = JSON.parse(authString);
      if (typeof auth[`${target}`] === 'undefined') {
        return '';
      }
      return auth[`${target}`];
    }
    return '';
  }
}
