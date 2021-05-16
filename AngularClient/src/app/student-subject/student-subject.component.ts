import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentSubject } from '../models/StudentSubject';
import { StudentSubjectServiceService } from '../shared/studentSubjectService/student-subject-service.service';
import { StudentSubjectStatisticModalComponent } from '../subject/student-subject-statistic-modal/student-subject-statistic-modal.component';

@Component({
  selector: 'app-student-subject',
  templateUrl: './student-subject.component.html',
  styleUrls: ['./student-subject.component.css']
})
export class StudentSubjectComponent implements OnInit {

  studentSubjectList:StudentSubject[]=[];
  loading: boolean = true;
  @ViewChild('studentSubjectStatisticModal', { static: true }) studentSubjectStatisticModal: StudentSubjectStatisticModalComponent;
  constructor(private studentSubjectService: StudentSubjectServiceService) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    this.studentSubjectService.getAll().subscribe((res:StudentSubject[])=>{
      this.studentSubjectList =res;
      this.loading = false;
    });
  }

}
