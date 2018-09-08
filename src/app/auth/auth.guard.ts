import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as RouteClaims from './route.claims';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let nextRouteUrl = state.url;
    let routeClaims = this.getRouteClaims(nextRouteUrl);
    let routeCanActivate = true;

    if (this.signInRequired(nextRouteUrl) && !this.authService.isAuthenticated()) {
      this.toastr.info('ابتدا باید با نام کاربری خود وارد سامانه شوید');
      this.router.navigate(['/login']);
      return false;
      // this.authService.signIn().subscribe(result => {
      //   if (result) {
      //     for (let claim of routeClaims) {
      //       routeCanActivate = routeCanActivate && this.authService.userHasClaim(claim);
      //     }
      //     if (!routeCanActivate) {
      //       this.snackBar.open('شما مجوز دسترسی به این بخش را ندارید', 'خطا', { duration: 2000 });
      //     }
      //     if (routeCanActivate) this.router.navigate([nextRouteUrl]);
      //     return routeCanActivate;
      //   } else {
      //     return false;
      //   }
      // });
    }
    else {
      for (let claim of routeClaims) {
        routeCanActivate = routeCanActivate && this.authService.userHasClaim(claim);
      }
      if (!routeCanActivate) {
        this.toastr.error('شما مجوز دسترسی به این بخش را ندارید', 'خطا');
      }
      return routeCanActivate;
    };
  }

  // canActivateChild(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  //   let nextRouteUrl = state.url;
  //   let routeClaims = this.getRouteClaims(nextRouteUrl);
  //   let routeCanActivate = true;

  //   // show signIn dialog if user must sign in
  //   if (this.signInRequired(nextRouteUrl) && !this.authService.isAuthenticated()) {
  //     this.toastr.info('ابتدا باید با نام کاربری خود وارد شوید', 'خطا');
  //     this.authService.signIn().subscribe(result => {
  //       if (result) {
  //         for (let claim of routeClaims) {
  //           routeCanActivate = routeCanActivate && this.authService.userHasClaim(claim);
  //         }
  //         if (!routeCanActivate) {
  //           this.toastr.error('شما مجوز دسترسی به این بخش را ندارید', 'خطا');
  //         }
  //         if (routeCanActivate) this.router.navigate([nextRouteUrl]);
  //         return routeCanActivate;
  //       }
  //       else return false;
  //     });
  //   }
  //   else {
  //     for (let claim of routeClaims) {
  //       routeCanActivate = routeCanActivate && this.authService.userHasClaim(claim);
  //     }
  //     if (!routeCanActivate) {
  //       this.toastr.error('شما مجوز دسترسی به این بخش را ندارید', 'خطا');
  //     }
  //     return routeCanActivate;
  //   };
  // }

  getRouteClaims(routeUrl: string) {
    let route = RouteClaims.default.Routes.find(r => r.routeUrl === routeUrl);
    let claims = route.claims;
    return claims;
  }

  signInRequired(routeUrl: string): boolean {
    let route = RouteClaims.default.Routes.find(r => r.routeUrl === routeUrl);
    if (route) return (route.signInRequired === 'true');
    else return false;
  }

}
