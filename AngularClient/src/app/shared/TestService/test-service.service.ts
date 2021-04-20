import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Test } from 'src/app/models/Test';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http:HttpClient) { }

  readonly BaseURI = 'https://localhost:44352/api';

  Create(test:Test){
    return this.http.post(this.BaseURI + '/Test/CreateTest',test);
  }
  CreateOrEdit(test:Test){
    return this.http.post(this.BaseURI + '/Test/CreateOrEdit',test);
  }

  getAllforUser(){
    return this.http.get(this.BaseURI + '/Test/GetAllForUser');
  }

  getById(Id){
    return this.http.get(this.BaseURI + '/Test/GetById',{params: {id:Id}});
  }

  delete(Id){
    return this.http.delete(this.BaseURI + '/Test/Delete',{params: {id:Id}});
  }
}
