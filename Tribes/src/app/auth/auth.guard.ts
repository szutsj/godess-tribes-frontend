import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router/src/router_state';
import { UserService } from '../_services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    console.log('AuthGuard#canActivate called');

    if (this.userService.isLogged()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
