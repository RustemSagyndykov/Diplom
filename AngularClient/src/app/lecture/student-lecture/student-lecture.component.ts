import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Lecture } from 'src/app/models/Lecture';
import { LectureService } from 'src/app/shared/lectureService/lecture.service';
import { ViewLectureModalComponent } from '../view-lecture-modal/view-lecture-modal.component';

@Component({
  selector: 'app-student-lecture',
  templateUrl: './student-lecture.component.html',
  styleUrls: ['./student-lecture.component.css']
})
export class StudentLectureComponent implements OnInit {

  lectureList:Lecture[] = [];
  loading: boolean = true;

  @ViewChild('viewLectureeModal', { static: true }) viewLectureeModal: ViewLectureModalComponent;   


  constructor(private service: LectureService,private router: Router) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.service.getAllForStudent().subscribe((res: Lecture[]) => {
      this.lectureList = res;
      this.loading = false;
      console.log(this.lectureList);
    });
  }

  viewLecture(id:number){
    this.router.navigate(['/home/lecture'], { queryParams: { id: id, edit:false } }).then(f => { location.reload(true) });
  }

}
