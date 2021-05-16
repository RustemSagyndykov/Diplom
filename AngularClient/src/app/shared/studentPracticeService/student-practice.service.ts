import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StudentPractice } from '../../models/StudentPractice';
import { URI } from '../../models/URI';

@Injectable({
  providedIn: 'root'
})
export class StudentPracticeService {

  constructor(private http:HttpClient) { }

  private readonly BaseURI = URI.BaseURI;

  createOrEdit(studentPractice:StudentPractice){
    return this.http.post(this.BaseURI + '/StudentPractice/CreateOrEdit',studentPractice);
  }

  getAll(){
    return this.http.get(this.BaseURI + '/StudentPractice/GetAll');
  }

  getById(Id){
    return this.http.get(this.BaseURI + '/StudentPractice/GetById',{params: {id:Id}});
  }

  getByIdForTeacher(Id){
    return this.http.get(this.BaseURI + '/StudentPractice/GetByIdForTeacher',{params: {id:Id}});
  }

  getAllForTeacher(){
    return this.http.get(this.BaseURI + '/StudentPractice/GetAllForTeacher');
  }
}
