import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import 'rxjs/add/operator/catch';
import { DarkhastType } from '../shared/types/darkhast';
import { ApiService } from '../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent implements OnInit {

  @ViewChild("safeKharidGrid") gridSafeKharid: DxDataGridComponent
  @ViewChild("safeForushGrid") gridSafeForush: DxDataGridComponent
  @ViewChild("noeDarkhastSelect") noeDarkhastSelect: any

  safeKharid: DarkhastType[];
  safeForush: DarkhastType[];

  tedadSahm: number;
  arzeshSahm: number;
  noeDarkhast: number;

  ngOnInit(): void {
    this.gridSafeKharid.rtlEnabled = true;
    this.gridSafeKharid.showBorders = true;

    this.gridSafeForush.rtlEnabled = true;
    this.gridSafeForush.showBorders = true;

    this.getSafeKharid();
    this.getSafeForush();
  }

  constructor(private apiService: ApiService, private toastr: ToastrService) { }

  getSafeKharid() {
    this.apiService.getSafeKharid().subscribe((data) => {
      this.safeKharid = data;
    });
  }

  getSafeForush() {
    this.apiService.getSafeForush().subscribe((data) => {
      this.safeForush = data;
    });
  }

  sabtDarkhast() {

    let darkhast: DarkhastType = {
      tedadSahm: this.tedadSahm,
      arzeshSahm: this.arzeshSahm
    }

    let noeDarkhast = this.noeDarkhastSelect.nativeElement.selectedIndex;

    // بررسی میکنیم که کاربر درخواست متقابلی در صف نداشته باشد
    this.apiService.checkUserHasNoActiveCrossRequest(noeDarkhast).subscribe(
      (result) => {
        if (!result) {
          this.toastr.error('ثبت درخواست خرید و فروش همزمان مجاز نمی باشد');
        } else {

          // ثبت درخواست
          // kharid sahm
          if (noeDarkhast == 0) {
            this.apiService.sabtDarkhastKharid(darkhast).subscribe((result) => {
              this.getSafeKharid();
              this.toastr.success('درخواست خرید شما با موفقیت به صف خرید افزوده شد')
            }, (error) => {
              console.log(error);
              this.toastr.error('خطا در افزودن درخواست به صف خرید');
            })
          }
          //forush sahm
          else if (noeDarkhast == 1) {
            // کنترل می کنیم تعداد درخواست فروش بیشتر از تعداد دارایی سهام نباشد
            // تعداد سهام درخواست جدید
            let tedadDarkhast: number = darkhast.tedadSahm || 0;
            // تعداد دارایی سهام
            this.apiService.getUserPortfoDarayi().subscribe(
              (data) => {
                let tedadDarayi: number = data[0].tedadSahm || 0;
                // محاسبه مجموع سهام تمامی درخواست های فروش فعلی کاربر
                this.apiService.getTedadKolSahamForushUser().subscribe(
                  (data: any) => {
                    let tedadKolSahamForushUser: number = data.tedadKolSahamForush || 0;
                    // محاسبه مجموع سهام تمامی درخواست های فروش فعلی کاربر
                    let tedadMojoud = tedadDarayi - tedadKolSahamForushUser;
                    console.log(`tedadDarkhast:${tedadDarkhast}`);
                    console.log(`tedadDarayi:${tedadDarayi}`);
                    console.log(`tedadKolSahamForushUser:${tedadKolSahamForushUser}`);
                    console.log(`tedadMojoud:${tedadMojoud}`);

                    if (tedadDarkhast > tedadMojoud) {
                      this.toastr.error('تعداد سهام درخواست فروش  بیشتر از تعداد دارایی سهام شما می باشد');
                      return;
                    }
                    // در صورتی که تعداد سهام جهت فروش بیشتر از دارایی نباشد درخواست را ثبت میکنیم
                    this.apiService.sabtDarkhastForush(darkhast).subscribe((result) => {
                      this.getSafeForush();
                      this.toastr.success('درخواست فروش شما با موفقیت به صف فروش افزوده شد')
                    }, (error) => {
                      console.log(error);
                      this.toastr.error('خطا در افزودن درخواست به صف فروش');
                    });
                  },
                  (error) => {
                    console.log(error);
                    this.toastr.error('خطا در محاسبه کل سهام صف فروش کاربر.با پشتیبان سیستم تماس بگیرید.');
                  }
                );
              },
              (error) => {
                console.log(error);
                this.toastr.error('خطا در بازیابی دارایی سهام.با پشتیبان سیستم تماس بگیرید.');
              }
            );

          }
        }
      },
      (error) => {
        console.log(error);
        this.toastr.error('خطا در افزودن درخواست به صف .با پشتیبان سامانه تماس بگیرید');
      });

  }

  async getTedadDarkhastSaf() {

  }

  mohasebehTedad(arzeshSahm: number) {

    this.apiService.getAkharinGheymatSahm()
      .subscribe(
        (res) => {
          let arzeshSahm = this.arzeshSahm;
          let gheymatRooz = res.gheymatRooz || 0;
          if (arzeshSahm > 0 && gheymatRooz > 0) {
            let tedadSahm = Math.floor(arzeshSahm / gheymatRooz);
            this.tedadSahm = tedadSahm;
          }
        },
        (error) => {
          console.log(error);
          this.toastr.error('خطا در بازیابی قیمت روز سهم.با پشتیبان سیستم تماس بگیرید.');
        }
      );
  }

  noeDarkhastChanged(event) {
    let selectedIndex = event.target.selectedIndex;
    if (selectedIndex == 1) this.arzeshSahm = null;
  }
}
