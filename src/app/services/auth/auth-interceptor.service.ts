import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // don't send token when user is not logged in
    if (!this.authService.isLoggedIn()) {
      return next.handle(req);
    }

    if (req.headers.get('skip')) {
      const modifiedHeader = req.headers.delete('skip');
      return next.handle(req.clone({ headers: modifiedHeader }));
    }

    // attach token and user id to request
    const modifiedReq = req.clone({
      headers: req.headers
        .set('authToken', this.authService.getToken())
        .set('userId', this.authService.getUserId()),
    });
    return next.handle(modifiedReq);
  }
}
