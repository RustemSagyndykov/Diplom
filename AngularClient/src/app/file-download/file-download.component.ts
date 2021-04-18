import { Component, Input, Output, EventEmitter,OnInit } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { FileDownloadService } from '../shared/fileService/file-download.service';
import { ProgressStatus, ProgressStatusEnum } from '../shared/fileService/file-download.service';

@Component({
  selector: 'app-download',
  templateUrl: './file-download.component.html',
  styleUrls: ['./file-download.component.css']
})
export class FileDownloadComponent implements OnInit {

  @Input() public disabled: boolean;
  @Input() public fileName: string;
  @Output() public downloadStatus: EventEmitter<ProgressStatus>;

  constructor(private service: FileDownloadService) {
    this.downloadStatus = new EventEmitter<ProgressStatus>();
  }

  ngOnInit(): void {
  }

  public download() {
    this.downloadStatus.emit( {status: ProgressStatusEnum.START});
    this.service.downloadFile(this.fileName).subscribe(
      data => {
        switch (data.type) {
          case HttpEventType.DownloadProgress:
            this.downloadStatus.emit( {status: ProgressStatusEnum.IN_PROGRESS, percentage: Math.round((data.loaded / data.total) * 100)});
            break;
          case HttpEventType.Response:
            this.downloadStatus.emit( {status: ProgressStatusEnum.COMPLETE});
            const downloadedFile = new Blob([data.body], { type: data.body.type });
            const a = document.createElement('a');
            a.setAttribute('style', 'display:none;');
            document.body.appendChild(a);
            a.download = this.fileName;
            a.href = URL.createObjectURL(downloadedFile);
            a.target = '_blank';
            a.click();
            document.body.removeChild(a);
            break;
        }
      },
      error => {
        this.downloadStatus.emit( {status: ProgressStatusEnum.ERROR});
      }
    );
  }

}
