import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
  // styles: [
  // ]
})
export class RegistrationComponent implements OnInit {

  constructor( public service: UserService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.service.formModel.reset();
  }

  onSubmit(){
    this.service.register().subscribe(
      (res: any) => {
        if(res.succeeded){
          this.service.formModel.reset();
          this.toastr.success('New user created!', 'Registration successful.');
        }else{
          res.errors.forEach(element => {
            switch(element.code)
            {
              case 'DublicateUserName':
                this.toastr.error('UserName is already taken','Registration failed.');
                break;
              default:
                this.toastr.error(element.description,'Registration failed.');
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
