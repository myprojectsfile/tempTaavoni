import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {

  }

  intercept(req, next) {
    var token = this.authService.getToken();

    if (token)
      var authRequest = req.clone({
        headers: req.headers.set('Authorization', 'token ' + this.authService.getToken())
      });
    else
      authRequest = req;

    return next.handle(authRequest);
  }

}
