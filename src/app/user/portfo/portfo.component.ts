import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { PortfoType } from '../../shared/types/portfo';
import { MoamelehType } from '../../shared/types/moameleh';
import { ToastrService, Toast } from 'ngx-toastr';

@Component({
  selector: 'app-portfo',
  templateUrl: './portfo.component.html',
  styleUrls: ['./portfo.component.css']
})
export class PortfoComponent implements OnInit {

  userPortfo: PortfoType;
  moamelat: MoamelehType[];

  constructor(private apiService: ApiService, private toastr: ToastrService) {

  }

  ngOnInit() {
    this.apiService.getUserPortfo().subscribe(
      (portfo) => {
        console.log(portfo);
        this.userPortfo = portfo[0];
        this.moamelat = portfo[0].moamelat;
      },
      (error) => {
        console.log(error);
        this.toastr.error('خطا در بازیابی داده های پورتفوی کاربر.با پشتیبان سامانه تماس بگیرید.');
      })
  }

}
