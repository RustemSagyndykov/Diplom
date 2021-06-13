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

  getAll(filterText:string){
    return this.http.get(this.BaseURI + '/StudentPractice/GetAll',{params: {filterText:filterText}});
  }

  getById(Id){
    return this.http.get(this.BaseURI + '/StudentPractice/GetById',{params: {id:Id}});
  }

  getByIdForTeacher(Id){
    return this.http.get(this.BaseURI + '/StudentPractice/GetByIdForTeacher',{params: {id:Id}});
  }

  getAllForTeacher(filterText:string){
    return this.http.get(this.BaseURI + '/StudentPractice/GetAllForTeacher',{params: {filterText:filterText}});
  }
}
