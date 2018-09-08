import { Component, OnInit, ViewChild } from '@angular/core';
import 'rxjs/add/operator/catch';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import { DarkhastType } from '../shared/types/darkhast';
import { ApiService } from '../shared/services/api.service';

declare var $: any;
@Component({
  selector: 'app-request-admin',
  templateUrl: './request-admin.component.html',
  styleUrls: ['./request-admin.component.css']
})

export class RequestAdminComponent implements OnInit {
  listDarkhast: DarkhastType[];
  listDarkhastDataSource: any;
  @ViewChild("listDarkhastGrid") listDarkhastGrid: DxDataGridComponent;
  oldTedadSahm: number;
  editingRowKey: string;
  editingMode: boolean;
  gridInstance: DxDataGridComponent["instance"];

  constructor(private apiService: ApiService, private toastr: ToastrService) { }

  ngOnInit() {
    this.listDarkhastGrid.instance = this.listDarkhastGrid.instance;
    this.apiService.getListDarkhastUser().subscribe((data) => {
      this.listDarkhast = data;
      this.listDarkhastDataSource = {
        store: {
          type: 'array',
          key: '_id',
          data: this.listDarkhast
        }
      };
    });
  }

  cancel(d) {
    let rowKey = d.data._id;
    let rowData: DarkhastType = d.data;
    let rowIndex = this.listDarkhastGrid.instance.getRowIndexByKey(d.data._id);
    rowData.vazeiat = 'لغو شده';
    this.apiService.updateDarkhast(rowData, rowKey).subscribe(() => {
      this.listDarkhastGrid.instance.cellValue(rowIndex, 'vazeiat', 'لغو شده');
      this.toastr.success('درخواست با موفقیت لغو گردید');
      this.listDarkhastGrid.instance.cancelEditData();
    }, (error) => {
      this.toastr.error('خطا در لغو درخواست');
      console.log(error);
    });
  }

  editRow(d) {
    this.editingMode = true;
    let rowKey = d.data._id;
    this.editingRowKey = rowKey;
    let rowData: DarkhastType = d.data;
    let rowIndex = this.listDarkhastGrid.instance.getRowIndexByKey(d.data._id);
    this.oldTedadSahm = this.listDarkhastGrid.instance.cellValue(rowIndex, 'tedadSahm');
    this.listDarkhastGrid.instance.editCell(rowIndex, 'tedadSahm');
  }

  rowUpdating(e) {
    let newTedadSahm = e.newData.tedadSahm;
    let oldTedadSahm = this.oldTedadSahm;
    if (newTedadSahm < oldTedadSahm) {
      console.log(e);
      let rowData = e.oldData;
      rowData.tedadSahm = newTedadSahm;
      this.apiService.updateDarkhast(rowData, this.editingRowKey).subscribe(() => {
        this.toastr.success('تعداد با موفقیت کاهش یافت');
        this.editingMode = false;
        this.listDarkhastGrid.instance.cancelEditData();
        e.cancel = true;
      }, (error) => {
        this.toastr.error('خطا در کاهش تعداد');
        e.cancel = true;
        this.listDarkhastGrid.instance.cancelEditData();
        console.log(error);
      });
    } else {
      this.toastr.error('شما تنها مجاز به کاهش تعداد هستید');
      e.cancel = true;
      this.editingMode = false;
      this.listDarkhastGrid.instance.cancelEditData();
    }
  }

  keyDown(e) {
    if (e.event.keyCode == 27) {
      this.editingMode = false;
      this.listDarkhastGrid.instance.cancelEditData();
    }
  }

  cancelEdit(d) {
    this.listDarkhastGrid.instance.cancelEditData();
    this.editingMode = false;
  }

  saveChange(d) {
    this.listDarkhastGrid.instance.saveEditData();
    this.editingMode = false;
  }
}
