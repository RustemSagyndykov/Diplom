import { Component, OnInit, ViewChild, Output,EventEmitter } from '@angular/core';
import { UserModel } from '../../../models/UserModel';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UserService, ApplicationUser } from 'src/app/shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-or-edit-users-modal',
  templateUrl: './create-or-edit-users-modal.component.html',
  styleUrls: ['./create-or-edit-users-modal.component.css']
})
export class CreateOrEditUsersModalComponent implements OnInit {

  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<UserModel> = new EventEmitter<UserModel>();

  active = false;
  saving = false;
  isValid = true;
  edit = false;

  user: UserModel = new UserModel();
  userTemp: UserModel = new UserModel();

  constructor(private toastr: ToastrService, private service:UserService) { }

  ngOnInit(): void {
    this.user = new UserModel();
  }

  show(user?: UserModel): void { 
    this.edit = false;
    
    if (!user) {
        this.user = new UserModel();

        this.active = true;
        this.modal.show();
    } else {
        this.service.getById(user.id).subscribe((res:UserModel)=>{
          this.user = res;
          console.log(res);
        });
        this.userTemp.userName = user.userName;
        //this.userTemp.fullName = user.fullName;
        this.userTemp.firstName = user.firstName;
        this.userTemp.lastName = user.lastName;
        this.userTemp.patronymic = user.patronymic;
        this.userTemp.email = user.email;
        this.userTemp.phoneNumber = user.phoneNumber;
        this.userTemp.role = user.role;
        this.edit = true;
        this.active = true;
        this.modal.show();
    }
  }

  save(): void {
    this.saving = true;

    var appUser = new ApplicationUser();

    appUser.email = this.user.email;
    //appUser.fullName = this.user.fullName;
    appUser.firstName = this.user.firstName;
    appUser.lastName = this.user.lastName;
    appUser.patronymic = this.user.patronymic;
    appUser.phoneNumber = this.user.phoneNumber;
    appUser.userName = this.user.userName;
    appUser.id = this.user.id;
    appUser.role = this.user.role;

    if(this.edit == true){
      this.service.updateUser(appUser)
      .pipe(finalize(() => { this.saving = false;}))
      .subscribe(res =>{
        this.toastr.success('Saved!', 'User Saved successful.');
        this.close();
        this.modalSave.emit(null);
      });
    }else{
      appUser.password = this.user.password;
      this.service.create(appUser)
      .pipe(finalize(() => { this.saving = false;}))
      .subscribe(
        (res: any) => {
          if(res.succeeded){
            this.toastr.success('New user created!', 'Created successful.');
            this.close();
            this.modalSave.emit(null);
          }else{
            res.errors.forEach(element => {
              switch(element.code)
              {
                case 'DublicateUserName':
                  this.toastr.error('UserName is already taken','Created failed.');
                  break;
                default:
                  this.toastr.error(element.description,'Created failed.');
                  break;
              }
            });
          }
        },
        err => {
          console.log(err)
        }
      );
    }
  }

  close(): void {
    if(this.edit == true && this.saving == false){
      this.user.userName = this.userTemp.userName;
      //this.user.fullName = this.userTemp.fullName;
      this.user.firstName = this.userTemp.firstName;
      this.user.lastName = this.userTemp.lastName;
      this.user.patronymic = this.userTemp.patronymic;
      this.user.email = this.userTemp.email;
      this.user.phoneNumber = this.userTemp.phoneNumber;
      this.user.role = this.userTemp.role;
    }
        
    this.active = false;
    this.modal.hide();
  }


}
