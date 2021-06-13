import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ForgotPassword } from 'src/app/models/ForgotPassword';
import { UserService } from 'src/app/shared/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { URI } from '../../models/URI';

@Component({
  selector: 'app-forgot-password-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.css']
})
export class ForgotPasswordModalComponent{

  @ViewChild('forgotPasswordModal', { static: true }) modal: ModalDirective;
  saving = false;
  forgotPassword: ForgotPassword = new ForgotPassword();
  private readonly ClientURI = URI.ClientURI;

  constructor(private service: UserService, private toastr: ToastrService, private router: Router) { }

  show(): void { 
    this.forgotPassword = new ForgotPassword();
    this.modal.show();
    this.forgotPassword.email
  }

  send(): void {
    this.forgotPassword.clientURI = this.ClientURI + 'resetPswd/resetPassword';
    this.saving = true;
    this.service.forgotPassword(this.forgotPassword).subscribe(_ => {
      this.toastr.success('Ссылка была отправлена, пожалуйста, проверьте свою электронную почту, чтобы сбросить пароль.','Отправлено!');
      this.saving = false;
      this.close();
    },
    err => {
      this.toastr.error('Такого email адреса не существует в приложении.','Провал!');
      this.saving = false;
    });
  }

  close(): void {
    this.modal.hide();
  }

}
