import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { UserModel } from '../models/UserModel';
import { ChangePassword } from '../models/ChangePassword';
import { URI } from '../models/URI';
import { ForgotPassword} from '../models/ForgotPassword';
import { ResetPassword } from '../models/ResetPassword';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fb:FormBuilder, private http:HttpClient) { }

  //readonly BaseURI = 'https://localhost:44352/api';
  private readonly BaseURI = URI.BaseURI;

  formModel = this.fb.group({
    UserName: ['', Validators.required],
    Email: ['', [Validators.email, Validators.required]],
    //FullName: [''],
    Role: ['',Validators.required],
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
      //Email: this.formModel.value.Email,
      //FullName: this.formModel.value.FullName,
      Role: this.formModel.value.Role,
      Password: this.formModel.value.Passwords.Password,
    };

    return this.http.post(this.BaseURI + '/ApplicationUser/Register',body);

  }

  create(user:ApplicationUser){
    return this.http.post(this.BaseURI + '/ApplicationUser/Register',user);
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

  updateUser(user:ApplicationUser){
    return this.http.post(this.BaseURI + '/UserProfile/UpdateUser',user);
  }

  getAll(filterText: string){
    return this.http.get(this.BaseURI + '/UserProfile/GetAll',{params: {filterText:filterText}});
  }

  getById(Id){
    return this.http.get(this.BaseURI + '/UserProfile/GetById',{params: {id:Id}});
  }

  blockAndUnBlockUser(user:UserModel){
    return this.http.post(this.BaseURI + '/UserProfile/BlockAndUnBlockUser',user);
  }

  deleteUser(Id){
    return this.http.delete(this.BaseURI + '/UserProfile/Delete',{params: {id:Id}});
  }

  changePassword(model:ChangePassword){
    return this.http.post(this.BaseURI + '/UserProfile/ChangPassword',model);
  }

  forgotPassword(forgotPswd: ForgotPassword){
    return this.http.post(this.BaseURI + '/ApplicationUser/ForgotPassword',forgotPswd);
  }

  resetPassword(resetPswd: ResetPassword){
    return this.http.post(this.BaseURI + '/ApplicationUser/ResetPassword',resetPswd);
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
  public id:string;
  public userName:string;
  public email:string;
  public password:string;
  //public fullName:string;
  public firstName: string;
  public lastName: string;
  public patronymic: string;
  public phoneNumber:string;
  public imgPath: string;
  public isBlocked: boolean;
  public role: string;
  public dateBirthday: Date;
}
