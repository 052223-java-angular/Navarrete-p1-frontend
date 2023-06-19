import { Injectable } from '@angular/core';
import { loginUserReq, loginUserRes, registerUserReq } from '../../models/auth';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /* ---------------- Methods ------------------ */
  register(user: registerUserReq): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/register`, user);
  }

  login(user: loginUserReq): Observable<loginUserRes> {
    return this.http.post<loginUserRes>(`${this.apiUrl}/auth/login`, user);
  }
}
