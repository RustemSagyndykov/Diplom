import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationUser, UserService } from '../shared/user.service';
import { UserRole } from '../models/Roles';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userDetails:ApplicationUser;
  isCollapsed = false;
  userRoles = UserRole;
  role;

  constructor(private router: Router, private service: UserService) { }

  ngOnInit(): void {
    this.role = this.getUserRole();
    this.service.getUserProfile().subscribe(
      (res:ApplicationUser) =>{
        this.userDetails = res;
      },
      err =>{
        // if(err.status == 401)
        // {
        //   localStorage.removeItem('token');
        //   this.router.navigate(['/user/login']);
        //   console.log("Error Shakhzad");
        // }
        // else
        console.log(err);
      }
    );
  }

  getUserRole(){
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    var userRole = payLoad.role;
    return userRole;
  }

  onLogout(){
    localStorage.removeItem('token');
    this.router.navigate(['/user/login']);
  }

}
