import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'src/app/models/Subject';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor(private http:HttpClient) { }

  readonly BaseURI = 'https://localhost:44352/api';

  getAll(){
    return this.http.get(this.BaseURI + '/Subject/GetAll');
  }

  getById(Id){
    return this.http.get(this.BaseURI + '/Subject/GetById',{params: {id:Id}});
  }

  Create(subject:Subject){
    return this.http.post(this.BaseURI + '/Subject/Create',subject);
  }

  delete(Id){
    return this.http.delete(this.BaseURI + '/Subject/Delete',{params: {id:Id}});
  }

  CreateOrEdit(subject:Subject){
    return this.http.post(this.BaseURI + '/Subject/CreateOrEdit',subject);
  }
}
