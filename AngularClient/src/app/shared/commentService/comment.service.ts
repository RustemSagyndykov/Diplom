import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URI } from '../../models/URI';
import { Comment } from '../../models/Comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http:HttpClient) { }

  private readonly BaseURI = URI.BaseURI;

  getAllById(Id){
    return this.http.get(this.BaseURI + '/Comment/GetAllById',{params: {id:Id}});
  }

  create(comment:Comment){
    return this.http.post(this.BaseURI + '/Comment/Create',comment);
  }
}
