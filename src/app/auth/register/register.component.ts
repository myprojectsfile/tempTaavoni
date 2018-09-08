import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private authService: AuthService, private apiService: ApiService, private toastr: ToastrService, private location: Location) { }

  errorMessage: string = null;
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
  family: string;
  codeMelli: string;
  mobile: string;


  register() {
    // چک میکنیم کاربری با نام کاربری یا کد ملی مشابه وجود نداشته باشد
    this.apiService.CheckUserExistByUsernameOrCodemelli(this.username, this.codeMelli).subscribe(
      (result) => {
        if (result) this.toastr.error('قبلا یک کاربر با کد سهامداری یا کد ملی مشابه ثبت شده است');
        else {
          this.authService.register(this.username, this.password, this.name, this.family, this.codeMelli, this.mobile)
            .subscribe(
              res => {
                this.authService.saveToken(res.token);
                this.toastr.success('به سامانه تعاونی کارکنان بندر بوشهر خوش آمدید');
                this.location.back();
              },
              errRes => {
                this.errorMessage = errRes.error.message;
              }
            );
        }
      },
      (error) => {
        console.log(error);
        this.errorMessage = error.message;
        this.toastr.error('خطا در فرآیند ثبت نام');
      }
    );
  }
}
