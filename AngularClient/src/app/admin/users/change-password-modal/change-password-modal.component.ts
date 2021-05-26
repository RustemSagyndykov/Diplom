import { Component, OnInit, ViewChild, Output,EventEmitter } from '@angular/core';
import { UserModel } from '../../../models/UserModel';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UserService} from 'src/app/shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { ChangePassword } from '../../../models/ChangePassword';
import Swal from 'sweetalert2' 

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.css']
})
export class ChangePasswordModalComponent {

  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<UserModel> = new EventEmitter<UserModel>();
  changePassword: ChangePassword = new ChangePassword();
  saving = false;
  isValid = true;
  showPswd = false;

  constructor(private toastr: ToastrService, private service:UserService) {}

  show(id?: string): void { 
    this.showPswd = false;
    this.changePassword = new ChangePassword();
    if (id != null) {
      this.changePassword.id = id;
    }else{
      this.changePassword.id = null;
    }
    this.modal.show();
  }

  save(): void {
    this.saving = true;
    this.isValid = true;

    if (this.changePassword.newPassword.length < 4) {
      this.isValid = false;
      Swal.fire({
        title: 'Ошибка!',
        text: 'Длина пароля не должна быть меньше 4 символов!',
        icon: 'error',
        confirmButtonText: 'Ок',
        confirmButtonColor: '#DC3545',
      })
      this.saving = false;
    }

    if (this.isValid) {
      this.service.changePassword(this.changePassword)
        .pipe(finalize(() => { this.saving = false; }))
        .subscribe(() => {
          this.toastr.success('Создано!', 'Новый пароль создан успешно.');
          this.close();
          this.modalSave.emit(null);
        });
    }
  }

  close(): void {
    this.modal.hide();
  }

  showHidePassword(){
    this.showPswd = !this.showPswd;
  }
}
