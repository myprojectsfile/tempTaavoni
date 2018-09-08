import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { JwtHelperService } from '@auth0/angular-jwt';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  username: string;
  password: string;
  errorMessage: string = null;

  constructor(private authService: AuthService, private location: Location, private toastr: ToastrService, private jwt: JwtHelperService) {

  }

  login() {
    this.authService.login(this.username, this.password).subscribe(
      res => {
        this.authService.saveToken(res.token);
        const isAuthenticted = this.authService.isAuthenticated();
        let tokenPayload: any = this.authService.tokenPayload();
        this.toastr.success('به سامانه تعاونی کارکنان بندر بوشهر خوش آمدید');
        this.location.back();
      }
      , errRes => {
        this.errorMessage = errRes;
      }
    );
  }
  ngOnInit() {
  }

}
