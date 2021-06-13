import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ResetPassword } from 'src/app/models/ResetPassword';
import { URI } from 'src/app/models/URI';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-reset-password-modal',
  templateUrl: './reset-password-modal.component.html',
  styleUrls: ['./reset-password-modal.component.css']
})
export class ResetPasswordModalComponent implements OnInit {

  @ViewChild('resetPasswordModal', { static: true }) modal: ModalDirective;
  saving = false;
  email = "";
  token = "";
  private readonly ClientURI = URI.ClientURI;

  resetPasswordModel: ResetPassword = new ResetPassword();
  resetPassword = this.fb.group({
      Password:['', [Validators.required, Validators.minLength(4)]],
      ConfirmPassword:['', Validators.required]
  },{validators: this.service.comparePasswords});

  constructor(private service: UserService, 
    private toastr: ToastrService, 
    private router: Router,
    private fb:FormBuilder,
    private activatedRoute: ActivatedRoute) {
      this.email = this.activatedRoute.snapshot.queryParams['email'];
      this.token = this.activatedRoute.snapshot.queryParams['token'];
    }

  ngOnInit(): void {
    this.resetPassword.reset();
    this.resetPasswordModel = new ResetPassword();
    this.modal.show();
  }

  reset(){
    this.saving = true;
    this.resetPasswordModel.email = this.email;
    this.resetPasswordModel.token = this.token;
    this.resetPasswordModel.password = this.resetPassword.get("Password").value;
    this.resetPasswordModel.confirmPassword = this.resetPassword.get("ConfirmPassword").value;

    this.service.resetPassword(this.resetPasswordModel).subscribe(_ => {
      this.toastr.success('Пароль был сбошен и успешно изменен.','Пароль изменен!');
      this.saving = false;
      this.router.navigateByUrl('/user/login');
      this.close();
    },
    error => {
      this.toastr.error('При изменении пароля произошла ошибка.','Провал!');
      this.saving = false;
      console.log(error);
  });

  }

  close(): void {
    this.modal.hide();
    this.router.navigateByUrl('/user/login');
  }

}
