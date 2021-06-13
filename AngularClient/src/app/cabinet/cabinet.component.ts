import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService,ApplicationUser } from '../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { URI } from '../models/URI';
import { FileDownloadService } from '../shared/fileService/file-download.service';
import { ProgressStatus, ProgressStatusEnum } from '../shared/fileService/file-download.service';
import { ChangePasswordModalComponent } from '../admin/users/change-password-modal/change-password-modal.component';

@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.css']
})
export class CabinetComponent implements OnInit {

  userDetails = new ApplicationUser();
  editMode = false;
  public response : {dbPath : ''}
  imageToShow:any;
  //readonly BaseURI = `https://localhost:44352/`;
  readonly BaseURI = URI.BaseURI;

  public files: string[];
  public fileInDownload: string;
  public percentage: number;
  public showProgress: boolean;
  public showDownloadError: boolean;
  @ViewChild('changePasswordModal', { static: true }) changePasswordModal: ChangePasswordModalComponent;

  constructor(private service: UserService,private toastr: ToastrService,private serviceDownload: FileDownloadService) { }

  ngOnInit(): void {
    this.getUserProfile()
    this.getFiles();
  }

  getUserProfile(){
    this.service.getUserProfile().subscribe(
      (res:ApplicationUser) =>{
        this.userDetails = res;
        this.createImgPath(res.imgPath);
      },
      err =>{
        console.log(err);
      }
    );
  }

  edit(){
    this.editMode = true;
  }

  undoEdit(){
    this.editMode = false;
    this.getUserProfile();
  }

  save(user: ApplicationUser){
    if(this.response == undefined || this.response == null)
      user.imgPath = "";
    else
      user.imgPath = this.response.dbPath;
    this.service.updateUserProfile(user).subscribe(
      (res: any) => {
        if(res.succeeded){
          this.toastr.success('Updated!', 'User Updated successful.');
        }else{
          res.errors.forEach(element => {
            console.log(element);
          });
        }
      },
      err => {
        console.log(err);
      }
    );

    this.editMode = false;
  }

  public uploadFinished = (event) =>{
    this.response = event;
    this.createImgPath(this.response.dbPath);
  }

  public createImgPath = (serverPath: string) => {
    if(serverPath)
      this.imageToShow = this.BaseURI + '/Download/GetPhoto?file='+serverPath;
      // return  this.BaseURI + `${serverPath}`;
  }



  //Download File

  private getFiles() {
    this.serviceDownload.getFiles().subscribe(
      data => {
        this.files = data;
      }
    );
  }

  public downloadStatus(event: ProgressStatus) {
    switch (event.status) {
      case ProgressStatusEnum.START:
        this.showDownloadError = false;
        break;
      case ProgressStatusEnum.IN_PROGRESS:
        this.showProgress = true;
        this.percentage = event.percentage;
        break;
      case ProgressStatusEnum.COMPLETE:
        this.showProgress = false;
        break;
      case ProgressStatusEnum.ERROR:
        this.showProgress = false;
        this.showDownloadError = true;
        break;
    }
  }

  changePassword(){
    this.changePasswordModal.show();
  }

}
