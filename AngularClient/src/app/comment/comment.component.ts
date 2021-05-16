import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from '../shared/commentService/comment.service';
import { ToastrService } from 'ngx-toastr';
import { Comment } from '../models/Comment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() StudentPracticeId: number;
  commentList: Comment[] = [];
  comment: Comment = new Comment();
  userId;

  constructor(private service: CommentService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.userId = this.getCurrentUserId();
    this.getAllById(this.StudentPracticeId);
  }

  getCurrentUserId(){
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    var userId = payLoad.UserID;
    return userId;
  }

  getAllById(StudentPracticeId:number){
    this.service.getAllById(StudentPracticeId).subscribe((res: Comment[]) => {
      this.commentList = res;
    });
  }

  create(){
    this.comment.studentPracticeId = this.StudentPracticeId;
    this.service.create(this.comment).subscribe(() => {
      this.getAllById(this.StudentPracticeId);
      this.toastr.success('Saved!', 'Comment Saved successful.');
      this.comment.commentContent = '';
    });
  }
}
