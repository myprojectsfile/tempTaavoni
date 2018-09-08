import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { Router, RouterLinkWithHref } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ClaimType } from '../shared/types/claim';

@Injectable()

export class AuthService {

  constructor(private httpClient: HttpClient, private router: Router, private jwt: JwtHelperService) { }

  apiUri = environment.apiUri;


  login(username, password) {
    let body = {
      username: username,
      password: password
    }

    return this.httpClient.post<any>(this.apiUri + '/login', body);
  }

  register(username, password, name, family, codeMelli, mobile) {
    let body = {
      username: username,
      password: password,
      name: name,
      family: family,
      codeMelli: codeMelli,
      mobile: mobile
    }

    return this.httpClient.post<any>(this.apiUri + '/register', body);

  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated();
    this.router.navigate(['']);
  }

  saveToken(token) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    let token = this.getToken();

    if (token) {
      let tokenDecoded = this.jwt.decodeToken(token);
      let isExpired = this.jwt.isTokenExpired(token);
      if (isExpired)
        return false;
      else return true;
    }

    return false;
  }

  userHasClaim(claim: string) {
    let token = this.getToken();
    if (token) {
      let tokenPayload: any = this.tokenPayload();
      let userClaims: ClaimType[] = tokenPayload.user.claims;
      let claimItem = userClaims.find((claimObject) => { return claimObject.claim === claim; });
      if (claimItem) return true;
    }

    return false;
  }

  tokenPayload() {
    let tokenPayload = this.jwt.decodeToken(this.getToken());
    return tokenPayload;
  }

  getUsername() {
    let tokenPayload = this.jwt.decodeToken(this.getToken());
    if (tokenPayload) return tokenPayload.user.username;
    return null;
  }

  getUserFullname() {
    let tokenPayload = this.jwt.decodeToken(this.getToken());
    if (tokenPayload) return tokenPayload.fullName;
    return null;
  }
}
