import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApplicationUser, UserService } from 'src/app/shared/user.service';
import { ForgotPasswordModalComponent } from '../forgot-password-modal/forgot-password-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
  // styles: [
  // ]
})
export class LoginComponent implements OnInit {

  formModel = {
    UserName: '',
    Password: ''
  }
  @ViewChild('forgotPasswordModalComponent', { static: true }) forgotPasswordModalComponent: ForgotPasswordModalComponent;

  constructor(private service: UserService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    if(localStorage.getItem('token') != null)
      this.router.navigateByUrl('/home/statistics');
  }

  onSubmit(form:NgForm){
    this.service.login(form.value).subscribe(
      (res: any) =>{
        localStorage.setItem('token',res.token);
        this.service.getUserProfile().subscribe((res:ApplicationUser)=>{
          if(res.isBlocked == true){
            localStorage.removeItem('token');
            this.toastr.error('Blocked','User is blocked');
          }else{
            this.router.navigateByUrl('/home/statistics');
          }
        });
      },
      err =>{
        if(err.status == 400)
          this.toastr.error('Incorrect username or password.','Authentication failed');
        else
          console.log(err);
      }
    );
  }
}
