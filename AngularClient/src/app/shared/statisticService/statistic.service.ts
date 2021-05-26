import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URI } from '../../models/URI';
import { Comment } from '../../models/Comment';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  constructor(private http:HttpClient) { }

  private readonly BaseURI = URI.BaseURI;

  getForStudent(){
    return this.http.get(this.BaseURI + '/Statistic/GetForStudent');
  }

  getForTeacher(){
    return this.http.get(this.BaseURI + '/Statistic/GetForTeacher');
  }

  getForAdmin(){
    return this.http.get(this.BaseURI + '/Statistic/GetForAdmin');
  }
}
