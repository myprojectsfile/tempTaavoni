import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { DarkhastComponent } from '../darkhast/darkhast.component';
import { MoamelehType } from '../shared/types/moameleh';
import { ToastrService } from 'ngx-toastr';
import { DarkhastType } from '../shared/types/darkhast';
import { Observable } from '../../../node_modules/rxjs';
import { PortfoType } from '../shared/types/portfo';
import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'app-moamelelat',
  templateUrl: './moamelat.component.html',
  styleUrls: ['./moamelat.component.css']
})
export class MoamelatComponent implements OnInit, AfterViewInit {


  constructor(private apiService: ApiService, private toastr: ToastrService) { }

  @ViewChild('safeKharid')
  safeKharidComponent: DarkhastComponent;
  @ViewChild('safeForush')
  safeForushComponent: DarkhastComponent;

  tradeButtonEnabled: boolean = true;

  ngOnInit() {

  }

  ngAfterViewInit(): void {
  }


  doTrade() {
    let avalinForushandeh: DarkhastType = this.safeForushComponent.getAvalinDarkhast();
    let avalinKharidar: DarkhastType = this.safeKharidComponent.getAvalinDarkhast();
    let tedadSahmForushandeh = avalinForushandeh.tedadBaghiMandeh;
    let tedadSahmKharidar = avalinKharidar.tedadBaghiMandeh;
    let _tedadSahmMoameleh = 0;
    let _arzeshSahmMoameleh = 0;
    // مشخصات درخواست های خرید و فروش
    let _tedadBaghimandehKharidar = avalinKharidar.tedadBaghiMandeh;
    let _tedadMoamelehShodehKharidar = avalinKharidar.tedadMoamelehShodeh;
    let _tedadBaghimandehForushandeh = avalinForushandeh.tedadBaghiMandeh;
    let _tedadMoamelehShodehForushandeh = avalinForushandeh.tedadMoamelehShodeh;

    // مشخص میکنیم تعداد درخواست خرید ها بیشتر است یا فروش ها
    // در صورتی که تعداد فروشنده بیشتر یا مساوی خریدار باشد
    if (tedadSahmForushandeh >= tedadSahmKharidar) {
      _tedadSahmMoameleh = tedadSahmKharidar;
      //در صورتی که تعداد فروشنده کمتر از خریدار باشد
    } else {
      _tedadSahmMoameleh = tedadSahmForushandeh;
    }

    // محاسبه تعداد معامله شده و تعداد باقیمانده خریدار و فروشنده
    _tedadMoamelehShodehKharidar = _tedadMoamelehShodehKharidar + _tedadSahmMoameleh;
    _tedadBaghimandehKharidar = avalinKharidar.tedadSahm - _tedadMoamelehShodehKharidar;
    _tedadMoamelehShodehForushandeh = _tedadMoamelehShodehForushandeh + _tedadSahmMoameleh;;
    _tedadBaghimandehForushandeh = avalinForushandeh.tedadSahm - _tedadMoamelehShodehForushandeh;

    // وضعیت درخواست خرید و فروش را محاسبه می کنیم
    let vazeiatDarkhastKharid, vazeiatDarkhastForush: string;

    if (_tedadBaghimandehKharidar == 0)
      vazeiatDarkhastKharid = 'انجام شده';
    else
      vazeiatDarkhastKharid = 'در حال انجام';

    if (_tedadBaghimandehForushandeh == 0)
      vazeiatDarkhastForush = 'انجام شده';
    else
      vazeiatDarkhastForush = 'در حال انجام';

    // ردیف معامله را آماده میکنیم
    let moamelehNewRow = this.prepareNewMoamelehRow(avalinForushandeh, avalinKharidar, _tedadSahmMoameleh, _arzeshSahmMoameleh);
    // آبجکت به روز رسانی درخواست خرید و فروش را ایجاد می کنیم
    let moamelatDarkhastKharid = avalinKharidar.moamelat || [];
    let moamelatDarkhastForush = avalinForushandeh.moamelat || [];
    let darkhastKharidUpdateObj: DarkhastType = {};
    let darkhastForushUpdateObj: DarkhastType = {};
    let darkhastKharidId: string = avalinKharidar._id;
    let darkhastForushId: string = avalinForushandeh._id;

    darkhastKharidUpdateObj.tedadMoamelehShodeh = _tedadMoamelehShodehKharidar;
    darkhastKharidUpdateObj.tedadBaghiMandeh = _tedadBaghimandehKharidar;
    darkhastKharidUpdateObj.vazeiat = vazeiatDarkhastKharid;
    moamelatDarkhastKharid.push(moamelehNewRow);
    darkhastKharidUpdateObj.moamelat = moamelatDarkhastKharid;

    darkhastForushUpdateObj.tedadBaghiMandeh = _tedadBaghimandehForushandeh;
    darkhastForushUpdateObj.tedadMoamelehShodeh = _tedadMoamelehShodehForushandeh;
    darkhastForushUpdateObj.vazeiat = vazeiatDarkhastForush;
    moamelatDarkhastForush.push(moamelehNewRow);
    darkhastForushUpdateObj.moamelat = moamelatDarkhastForush;

    // ثبت معامله  
    this.apiService.sabtMoameleh(moamelehNewRow).subscribe((newMoameleh) => {
      moamelehNewRow._id = newMoameleh._id;
      this.toastr.success('معامله جدید با موفقیت ثبت شد');
      this.updateDarkhastKharid(darkhastKharidUpdateObj, darkhastKharidId)
        .subscribe((data) => {
          // برای ردیف درخواست خرید ، یک ردیف معامله ثبت میکنیم          
          this.toastr.success('مشخصات درخواست خرید با موفقیت به روزرسانی شد');
          this.updateDarkhastForush(darkhastForushUpdateObj, darkhastForushId)
            .subscribe((data) => {
              // برای ردیف درخواست فروش ، یک ردیف معامله ثبت میکنیم
              this.toastr.success('مشخصات درخواست فروش با موفقیت به روزرسانی شد');
              // نمای گریدهای خرید و فروش را به روز رسانی میکنیم
              this.safeKharidComponent.loadDarkhastData();
              this.safeForushComponent.loadDarkhastData();
              // جدول دارایی سهام - پورتفو - خریدار و فروشنده را به روز رسانی میکنیم
              this.UpdatePortfoKharidar(avalinKharidar, _tedadSahmMoameleh, moamelehNewRow);
              this.UpdatePortfoForushandeh(avalinForushandeh, _tedadSahmMoameleh, moamelehNewRow);

            }, (error) => {
              console.log(error);
              this.toastr.error('خطا در به روز رسانی مشخصات درخواست فروش.با پشتیبان سامانه تماس بگیرید');
            });
        }, (error) => {
          console.log(error);
          this.toastr.error('خطا در به روز رسانی مشخصات درخواست خرید.با پشتیبان سامانه تماس بگیرید');
        });
    }, (error) => {
      console.log(error);
    });
  };

  private UpdatePortfoKharidar(avalinKharidar: DarkhastType, _tedadSahmMoameleh: number, moamelehNewRow: MoamelehType) {
    this.apiService.getPortfohByUsername(avalinKharidar.username)
      .subscribe((portfo) => {
        portfo = portfo[0];
        // تعداد سهم جدید خریدار را محاسبه میکنیم
        let tedadSahmJadid = portfo.tedadSahm + _tedadSahmMoameleh;
        let moamelatPortfoKharidar = portfo.moamelat || [];
        let portfoKharidarUpdateObj: PortfoType = {
          tedadSahm: tedadSahmJadid,
          moamelat: moamelatPortfoKharidar
        };

        // افزودن معامله به لیست معاملات پورتفو خریدار
        moamelehNewRow.shenasehMoameleh = moamelehNewRow._id;
        portfoKharidarUpdateObj.moamelat.push(moamelehNewRow);
        // پورتفو را به روزرسانی میکنیم
        this.apiService.updatePortfoById(portfoKharidarUpdateObj, portfo._id)
          .subscribe(() => {
            this.toastr.success('مشخصات جدول پورتفو خریدار با موفقیت به روزرسانی شد');
          }, (error) => {
            console.log(error);
            this.toastr.error('خطا در به روز رسانی جدول پورتفو خریدار.با پشتیبان سامانه تماس بگیرید');
          });
      }, (error) => {
        console.log(error);
        this.toastr.error('خطا در به بازیابی مشخصات پورتفو خریدار.با پشتیبان سامانه تماس بگیرید');
      });
  }

  private UpdatePortfoForushandeh(avalinForushandeh: DarkhastType, _tedadSahmMoameleh: number, moamelehNewRow: MoamelehType) {
    this.apiService.getPortfohByUsername(avalinForushandeh.username)
      .subscribe((portfo) => {
        // تعداد سهم جدید فروشنده را محاسبه میکنیم
        portfo = portfo[0];
        let tedadSahmJadid = portfo.tedadSahm - _tedadSahmMoameleh;
        let moamelatPortfoForushandeh = portfo.moamelat || [];
        let portfoForushandehUpdateObj: PortfoType = {
          tedadSahm: tedadSahmJadid,
          moamelat: moamelatPortfoForushandeh
        };
        // افزودن معامله به لیست معاملات پورتفو فروشنده
        moamelehNewRow.shenasehMoameleh = moamelehNewRow._id;
        portfoForushandehUpdateObj.moamelat.push(moamelehNewRow);
        // پورتفو فروشنده را به روزرسانی میکنیم
        this.apiService.updatePortfoById(portfoForushandehUpdateObj, portfo._id)
          .subscribe(() => {
            this.toastr.success('مشخصات جدول پورتفو فروشنده با موفقیت به روزرسانی شد');
          }, (error) => {
            console.log(error);
            this.toastr.error('خطا در به روز رسانی جدول پورتفو فروشنده.با پشتیبان سامانه تماس بگیرید');
          });
      }, (error) => {
        console.log(error);
        this.toastr.error('خطا در به بازیابی مشخصات پورتفو فروشنده.با پشتیبان سامانه تماس بگیرید');
      });
  }

  private prepareNewMoamelehRow(avalinForushandeh: DarkhastType, avalinKharidar: DarkhastType, _tedadSahmMoameleh: number, _arzeshSahmMoameleh: number): MoamelehType {
    let _forushandeh_username = avalinForushandeh.username;
    let _forushandeh_fullName = avalinForushandeh.fullName;
    let _forushandeh_darkhastId = avalinForushandeh._id;
    let _kharidar_username = avalinKharidar.username;
    let _kharidar_fullName = avalinKharidar.fullName;
    let _kharidar_darkhastId = avalinKharidar._id;
    let moameleh: MoamelehType = {
      tedadSahmMoameleh: _tedadSahmMoameleh,
      arzeshSahmMoameleh: _arzeshSahmMoameleh,
      forushandeh_username: _forushandeh_username,
      forushandeh_fullName: _forushandeh_fullName,
      forushandeh_darkhastId: _forushandeh_darkhastId,
      kharidar_username: _kharidar_username,
      kharidar_fullName: _kharidar_fullName,
      kharidar_darkhastId: _kharidar_darkhastId
    };

    return moameleh;
  }

  private updateDarkhastForush(darkhastForushUpdateObj: DarkhastType, darkhastForushId: string): Observable<DarkhastType> {
    return this.apiService.updateDarkhastById(darkhastForushUpdateObj, darkhastForushId);
  }

  private updateDarkhastKharid(darkhastKharidUpdateObj: DarkhastType, darkhastKharidId: string): Observable<DarkhastType> {
    return this.apiService.updateDarkhastById(darkhastKharidUpdateObj, darkhastKharidId);
  }

  private PostNewMoameleh(avalinForushandeh: DarkhastType, avalinKharidar: DarkhastType, _tedadSahmMoameleh: number, _arzeshSahmMoameleh: number): MoamelehType {
    let _forushandeh_username = avalinForushandeh.username;
    let _forushandeh_fullName = avalinForushandeh.fullName;
    let _forushandeh_darkhastId = avalinForushandeh._id;
    let _kharidar_username = avalinKharidar.username;
    let _kharidar_fullName = avalinKharidar.fullName;
    let _kharidar_darkhastId = avalinKharidar._id;

    let moameleh: MoamelehType = {
      tedadSahmMoameleh: _tedadSahmMoameleh,
      arzeshSahmMoameleh: _arzeshSahmMoameleh,
      forushandeh_username: _forushandeh_username,
      forushandeh_fullName: _forushandeh_fullName,
      forushandeh_darkhastId: _forushandeh_darkhastId,
      kharidar_username: _kharidar_username,
      kharidar_fullName: _kharidar_fullName,
      kharidar_darkhastId: _kharidar_darkhastId
    };

    this.apiService.sabtMoameleh(moameleh).subscribe((newMoameleh) => {
      console.log(newMoameleh);
      this.toastr.success('معامله جدید با موفقیت ثبت شد');
    }, (error) => {
      console.log(error);
    });

    return moameleh;
  }

  listKharidChanged(listKharid: DarkhastType[]) {
    let listKharidGtZero: boolean = (listKharid.length > 0);
    this.tradeButtonEnabled = this.tradeButtonEnabled && listKharidGtZero;
  }

  listForushChanged(listForush: DarkhastType[]) {
    let listForushGtZero: boolean = (listForush.length > 0);
    this.tradeButtonEnabled = this.tradeButtonEnabled && listForushGtZero;
  }
}
