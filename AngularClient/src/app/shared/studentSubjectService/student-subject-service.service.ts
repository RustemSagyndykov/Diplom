import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StudentSubject } from 'src/app/models/StudentSubject';
import { URI } from '../../models/URI';

@Injectable({
  providedIn: 'root'
})
export class StudentSubjectServiceService {

  constructor(private http:HttpClient) { }

  //readonly BaseURI = 'https://localhost:44352/api';
  private readonly BaseURI = URI.BaseURI;

  getAll(filterText: string){
    return this.http.get(this.BaseURI + '/StudentSubject/GetAll',{params: {filterText:filterText}});
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

  getStudentSubjectStatistic(Id){
    return this.http.get(this.BaseURI + '/StudentSubject/GetStudentSubjectStatistic',{params: {id:Id}});
  }
}
