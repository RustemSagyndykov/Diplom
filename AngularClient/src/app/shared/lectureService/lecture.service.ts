import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Lecture} from '../../models/Lecture';

@Injectable({
  providedIn: 'root'
})
export class LectureService {

  constructor(private http:HttpClient) { }

  readonly BaseURI = 'https://localhost:44352/api';

  createLecture(lecture:Lecture){
    return this.http.post(this.BaseURI + '/Lecture/CreateLecture',lecture);
  }

  createOrEdit(lecture:Lecture){
    return this.http.post(this.BaseURI + '/Lecture/CreateOrEdit',lecture);
  }

  getAll(){
    return this.http.get(this.BaseURI + '/Lecture/GetAllLecturesForUser');
  }

  getAllForAdmin(){
    return this.http.get(this.BaseURI + '/Lecture/GetAllLecturesForAdmin');
  }

  getAllForStudent(){
    return this.http.get(this.BaseURI + '/Lecture/GetAllLecturesForStudent');
  }

  getById(Id){
    return this.http.get(this.BaseURI + '/Lecture/GetAllLecturesById',{params: {id:Id}});
  }

  delete(Id){
    return this.http.delete(this.BaseURI + '/Lecture/Delete',{params: {id:Id}});
  }

}
