import { Component, OnInit, HostBinding, Input, Output, EventEmitter } from '@angular/core';
import { DarkhastType } from '../shared/types/darkhast';
import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'app-darkhast',
  templateUrl: './darkhast.component.html',
  styleUrls: ['./darkhast.component.css']
})
export class DarkhastComponent implements OnInit {

  constructor(private apiServivce: ApiService) { }

  @HostBinding('attr.noe-darkhast')
  @Input()
  noeDarkhast: string;

  @HostBinding('attr.columns-list')
  @Input()
  columnsList: string[];

  @Output() listChanged = new EventEmitter<DarkhastType[]>();

  listDarkhastDataSource: any;
  listDarkhast: DarkhastType[];

  showNoeDarkhast: boolean;
  showVazeiat: boolean;
  showTedadSahm: boolean;
  showTedadMoamelehShodeh: boolean;
  showTedadBaghiMandeh: boolean;
  showArzeshSahm: boolean;
  showTarikhDarkhast: boolean;
  showTozihat: boolean;
  showUsername: boolean;
  showFullName: boolean;

  ngOnInit() {
    this.loadDarkhastData();

    // مدیریت نمایش ستون های انتخاب شده
    this.showNoeDarkhast = this.columnsList.indexOf('noeDarkhast') > 0;
    this.showVazeiat = this.columnsList.indexOf('vazeiat') > 0;
    this.showTedadSahm = this.columnsList.indexOf('tedadSahm') > 0;
    this.showTedadMoamelehShodeh = this.columnsList.indexOf('tedadMoamelehShodeh') > 0;
    this.showTedadBaghiMandeh = this.columnsList.indexOf('tedadBaghiMandeh') > 0;
    this.showArzeshSahm = this.columnsList.indexOf('arzeshSahm') > 0;
    this.showTarikhDarkhast = this.columnsList.indexOf('tarikhDarkhast') > 0;
    this.showTozihat = this.columnsList.indexOf('tozihat') > 0;
    this.showUsername = this.columnsList.indexOf('username') > 0;
    this.showFullName = this.columnsList.indexOf('fullName') > 0;
  }

  public loadDarkhastData() {
    this.apiServivce.getListDarkhast(this.noeDarkhast).subscribe((data) => {
      this.listDarkhast = data;
      this.listChanged.emit(data);
      this.listDarkhastDataSource = {
        store: {
          type: 'array',
          key: '_id',
          data: this.listDarkhast
        }
      };
    });
  }

  // انتخاب اولین ردیف صف درخواست
  public getAvalinDarkhast() {
    if (this.listDarkhast.length > 0) {
      return this.listDarkhast[0];
    }
    return null;
  }
}
