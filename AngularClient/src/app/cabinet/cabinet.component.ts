import { Component, OnInit } from '@angular/core';
import { UserService,ApplicationUser } from '../shared/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.css']
})
export class CabinetComponent implements OnInit {

  userDetails = new ApplicationUser();
  editMode = false;

  constructor(private service: UserService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.service.getUserProfile().subscribe(
      (res:ApplicationUser) =>{
        this.userDetails = res;
      },
      err =>{
        console.log(err);
      }
    );
  }

  edit(){
    this.editMode = true;
  }

  save(user: ApplicationUser){
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

}
