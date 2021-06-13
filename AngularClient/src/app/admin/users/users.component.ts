import { Component, OnInit,ViewChild } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { UserModel } from '../../models/UserModel';
import { ToastrService } from 'ngx-toastr';
import { CreateOrEditUsersModalComponent } from './create-or-edit-users-modal/create-or-edit-users-modal.component';
import { ViewUsersModalComponent } from './view-users-modal/view-users-modal.component';
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  usersList:UserModel[] = [];
  loading: boolean = true;
  filterText='';
  constructor(private service:UserService,private toastr: ToastrService) { }
  @ViewChild('createOrEditUsersModal', { static: true }) createOrEditUsersModal: CreateOrEditUsersModalComponent;
  @ViewChild('viewUsersModal', { static: true }) viewUsersModal: ViewUsersModalComponent; 
  @ViewChild('changePasswordModal', { static: true }) changePasswordModal: ChangePasswordModalComponent;

  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    this.service.getAll(this.filterText).subscribe((res:UserModel[])=>{
      this.usersList = res;
      this.loading = false;
    });
  }

  getUser(){
    this.filterText = '';
    this.getAll();
  }
  getPassword(){
    this.filterText = '';
    this.getAll();
  }

  create(){
    this.createOrEditUsersModal.show();
  }

  blockAndUnBlockUser(user: UserModel){
    this.service.blockAndUnBlockUser(user).subscribe(res=>{
      if(res == true){
        this.toastr.success('Blocked!', 'User Bloked successful.');
        this.getAll();
      }
      else{
        this.toastr.success('UnBlocked!', 'User UnBloked successful.');
        this.getAll();
      }
    });
  }

  deleteUser(id:string){
    this.service.deleteUser(id).subscribe(res=>{
        this.getAll();
        this.toastr.success('Deleted!', 'User Deleted successful.');
    });
  }

  filterInput(event){
    if (event.key === 'Enter' || event.keyCode === 13) {
      this.getAll();
    }
  }
}
