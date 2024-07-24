import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private _authService = inject(AuthService);
  private _router = inject(Router);

  canActivate(): Observable<boolean> {
    return this._authService.isLoggedIn().pipe(
      map(isAuthenticated => {
        if (!isAuthenticated) {
          this._router.navigate(['/login']);
        }
        return isAuthenticated;
      })
    );
  }
}
