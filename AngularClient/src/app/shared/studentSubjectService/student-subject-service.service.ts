import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StudentSubject } from 'src/app/models/StudentSubject';

@Injectable({
  providedIn: 'root'
})
export class StudentSubjectServiceService {

  constructor(private http:HttpClient) { }

  readonly BaseURI = 'https://localhost:44352/api';

  getAll(){
    return this.http.get(this.BaseURI + '/StudentSubject/GetAll');
  }

  getById(Id){
    return this.http.get(this.BaseURI + '/StudentSubject/GetById',{params: {id:Id}});
  }

  create(studentSubject:StudentSubject){
    return this.http.post(this.BaseURI + '/StudentSubject/Create',studentSubject);
  }

  createOrEdit(studentSubject:StudentSubject){
    return this.http.post(this.BaseURI + '/StudentSubject/CreateOrEdit',studentSubject);
  }
}