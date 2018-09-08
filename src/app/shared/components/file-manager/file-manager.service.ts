import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FileManagerService {
  apiUri = environment.apiUri;
  fileUploadUri = this.apiUri + '/file/upload';

  constructor(private httpClient: HttpClient) { }

  uploadFile(file: File): Observable<HttpEvent<any>> {

    let formData = new FormData();
    formData.append('upload', file, file.name);

    let params = new HttpParams();

    const options = {
      params: params,
      reportProgress: true,
    };

    const req = new HttpRequest('POST', this.fileUploadUri, formData, options);
    return this.httpClient.request(req);
  }
}