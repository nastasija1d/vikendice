import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userStr = localStorage.getItem('ulogovaniKorisnik');
    if (!userStr) {
      this.router.navigate(['/login']);
      return false;
    }

    const user = JSON.parse(userStr);
    const allowedRoles: number[] = route.data['roles'];

    if (allowedRoles && allowedRoles.includes(user.tip)) {
      return true;
    }

    // ako nema pravo → vrati ga na login
    this.router.navigate(['/login']);
    return false;
  }
}
