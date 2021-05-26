import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Practice } from '../../models/Practice';
import { URI } from '../../models/URI';

@Injectable({
  providedIn: 'root'
})
export class PracticeService {

  constructor(private http:HttpClient) { }

  //readonly BaseURI = 'https://localhost:44352/api';
  private readonly BaseURI = URI.BaseURI;

  createPractice(practice:Practice){
    return this.http.post(this.BaseURI + '/Practice/Create',practice);
  }

  CreateOrEdit(practice:Practice){
    return this.http.post(this.BaseURI + '/Practice/CreateOrEdit',practice);
  }

  getAll(){
    return this.http.get(this.BaseURI + '/Practice/GetAllPracticeForTeacher');
  }

  getAllForAdmin(){
    return this.http.get(this.BaseURI + '/Practice/GetAllPracticeForAdmin');
  }

  getAllForStudent(){
    return this.http.get(this.BaseURI + '/Practice/GetAllForStudent');
  }

  getAllForLookupTable(){
    return this.http.get(this.BaseURI + '/Practice/GetAll');
  }

  getById(Id){
    return this.http.get(this.BaseURI + '/Practice/GetPracticeById',{params: {id:Id}});
  }

  delete(Id){
    return this.http.delete(this.BaseURI + '/Practice/Delete',{params: {id:Id}});
  }

}
