import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StudentTesting } from 'src/app/models/StudentTesting';

@Injectable({
  providedIn: 'root'
})
export class StudentTestingService {

  constructor(private http:HttpClient) { }

  readonly BaseURI = 'https://localhost:44352/api';

  createOrEdit(studentTesting:StudentTesting){
    return this.http.post(this.BaseURI + '/StudentTesting/CreateOrEdit',studentTesting);
  }

  create(studentTesting:StudentTesting){
    return this.http.post(this.BaseURI + '/StudentTesting/Create',studentTesting);
  }

  getAllForStudent(){
    return this.http.get(this.BaseURI + '/StudentTesting/GetAllForStudent');
  }
}
