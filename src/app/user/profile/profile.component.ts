import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../shared/services/api.service';
import { UserType } from '../../shared/types/user';
import { AuthService } from '../../auth/auth.service';
import { PasswordType } from '../../shared/types/password';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private toastr: ToastrService, private apiService: ApiService, private authService: AuthService) { }

  user: UserType = {};
  passwordObject: PasswordType = {};
  errorMessage: string = null;

  ngOnInit() {
    let username = this.authService.getUsername();
    this.apiService.getUserByUsername(username)
      .subscribe(
        (userData) => {
          this.user = userData[0];
        },
        (error) => {
          console.log(error);
          this.toastr.error('خطا در بازیابی مشخصات کاربر');
        }
      );
  }

  saveChanges() {
    this.apiService.updateUserById(this.user, this.user._id)
      .subscribe((data) => {
        this.toastr.success('تغییرات با موفقیت ثبت گردید');
      },
        (error) => {
          console.log(error);
          this.toastr.error('خطا در ثبت تغییرات پروفایل کاربر');
        });
  }

  changePass() {
    let userUpdate: UserType = {};
    userUpdate.password = this.passwordObject.newPassword;
    this.apiService.updateUserPassById(userUpdate, this.user._id)
      .subscribe((data) => {
        this.toastr.success('کلمه عبور با موفقیت تغییر یافت');
      },
        (error) => {
          console.log(error);
          this.toastr.error('خطا در تغییر کلمه عبور');
        });
  }
}
