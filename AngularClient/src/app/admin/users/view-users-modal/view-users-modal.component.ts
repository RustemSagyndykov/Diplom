import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subject } from 'src/app/models/Subject';
import { UserModel } from 'src/app/models/UserModel';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-view-users-modal',
  templateUrl: './view-users-modal.component.html',
  styleUrls: ['./view-users-modal.component.css']
})
export class ViewUsersModalComponent {

  @ViewChild('viewModal', { static: true }) modal: ModalDirective; 

    active = false;
    saving = false;

    user: UserModel = new UserModel();


    constructor(private service:UserService) {
      this.user = new UserModel();
    }

    show(id): void {
      this.service.getById(id).subscribe((res:UserModel)=>{
        this.user = res;
      });
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

}
