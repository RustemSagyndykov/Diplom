import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { URI } from '../../models/URI';


@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {

  private baseApiUrl: string;
  private apiDownloadUrl: string;
  private apiFileUrl: string;

  constructor(private httpClient: HttpClient) {
    //this.baseApiUrl = 'https://localhost:44352/api';
    this.baseApiUrl = URI.BaseURI;
    this.apiDownloadUrl = this.baseApiUrl + '/Download/download';
    this.apiFileUrl = this.baseApiUrl + '/Download/files';
   }

  public downloadFile(file: string): Observable<HttpEvent<Blob>> {
    return this.httpClient.request(new HttpRequest(
      'GET',
      `${this.apiDownloadUrl}?file=${file}`,
      null,
      {
        reportProgress: true,
        responseType: 'blob'
      }));
  }

  public getFiles(): Observable<string[]> {
    return this.httpClient.get<string[]>(this.apiFileUrl);
  }
}

export interface ProgressStatus {
  status: ProgressStatusEnum;
  percentage?: number;
}

export enum ProgressStatusEnum {
  START, COMPLETE, IN_PROGRESS, ERROR
}
