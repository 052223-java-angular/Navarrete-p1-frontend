import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { ToasterService } from '../toaster/toaster.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardService {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toaster: ToasterService
  ) {}

  canActivate = (
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | Promise<boolean> | Observable<boolean> => {
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl(`login`);
      this.toaster.error({ message: 'User is not logged inx.' });
      return false;
    }
    return true;
  };
}

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  router: RouterStateSnapshot
): boolean | Promise<boolean> | Observable<boolean> => {
  return inject(AuthGuardService).canActivate(route, router);
};
