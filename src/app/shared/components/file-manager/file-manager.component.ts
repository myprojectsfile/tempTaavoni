import { Component, OnInit } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { HttpResponse } from 'selenium-webdriver/http';
import { FileManagerService } from './file-manager.service';

@Component({
  selector: 'file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})
export class FileManagerComponent implements OnInit {

  constructor(private fimeMangerService: FileManagerService) { }

  selectedFile: File;

  ngOnInit() {

  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0]
  }

  uploadFile() {
    this.fimeMangerService.uploadFile(this.selectedFile)
      .subscribe(
        event => {
          if (event.type == HttpEventType.UploadProgress) {
            const percentDone = Math.round(100 * event.loaded / event.total);
            console.log(`File is ${percentDone}% loaded.`);
          } else if (event instanceof HttpResponse) {
            console.log('File is completely loaded!');
          }
        },
        (err) => {
          console.log("Upload Error:", err);
        }, () => {
          console.log("Upload done");
        }
      );
  }
}
