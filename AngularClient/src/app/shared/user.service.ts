import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fb:FormBuilder, private http:HttpClient) { }

  readonly BaseURI = 'https://localhost:44352/api';

  formModel = this.fb.group({
    UserName: ['', Validators.required],
    Email: ['', Validators.email],
    FullName: [''],
    Passwords: this.fb.group({
      Password:['', [Validators.required, Validators.minLength(4)]],
      ConfirmPassword:['', Validators.required]
    },{validators: this.comparePasswords})
  });

  comparePasswords(fb:FormGroup){
    let confirmPswdCtrl = fb.get('ConfirmPassword');
    if(confirmPswdCtrl.errors == null || 'passwordMismatch' in confirmPswdCtrl.errors){
      if(fb.get("Password").value != confirmPswdCtrl.value)
        confirmPswdCtrl.setErrors({passwordMismatch:true });
      else
        confirmPswdCtrl.setErrors(null);
    }
  }

  register(){
    var body = {
      UserName: this.formModel.value.UserName,
      Email: this.formModel.value.Email,
      FullName: this.formModel.value.FullName,
      Password: this.formModel.value.Passwords.Password,
    };

    return this.http.post(this.BaseURI + '/ApplicationUser/Register',body);

  }

  login(formData){
    return this.http.post(this.BaseURI + '/ApplicationUser/Login',formData);
  }

  getUserProfile(){
    // 1
    // var tokenHeader = new HttpHeaders({'Authorization':'Bearer ' + localStorage.getItem('token'), 'Content-Type': 'application/json'});
    
    // 2
    // var tokenHeader = new HttpHeaders({'Authorization':'Bearer ' + localStorage.getItem('token')});
    // return this.http.get(this.BaseURI + '/UserProfile',{headers: tokenHeader});


    return this.http.get(this.BaseURI + '/UserProfile');
  }

  updateUserProfile(user:ApplicationUser){
    return this.http.post(this.BaseURI + '/UserProfile/Update',user);
  }

  roleMatch(allowedRole): boolean{
    var isMatch = false;
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    var userRole = payLoad.role;
    allowedRole.forEach(element => {
      if(userRole == element){
        isMatch = true;
        return false;
      }
    });
    return isMatch;
  }
}

export class ApplicationUser{
  public userName:string;
  public email:string;
  public password:string;
  public fullName:string;
}
