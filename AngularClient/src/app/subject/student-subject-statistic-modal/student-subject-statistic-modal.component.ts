import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { StudentSubjectStatistic } from 'src/app/models/StudentSubjectStatistic';
import { StudentSubjectServiceService } from  '../../shared/studentSubjectService/student-subject-service.service';
import { StudentPractice } from '../../models/StudentPractice';
import { StudentTesting } from '../../models/StudentTesting';
import { StudentPracticeService } from 'src/app/shared/studentPracticeService/student-practice.service';
import { StudentTestingService } from 'src/app/shared/studentTestingService/student-testing-service.service';
 
@Component({
  selector: 'app-student-subject-statistic-modal',
  templateUrl: './student-subject-statistic-modal.component.html',
  styleUrls: ['./student-subject-statistic-modal.component.css']
})
export class StudentSubjectStatisticModalComponent implements OnInit {

  @ViewChild('viewModal', { static: true }) modal: ModalDirective;

  active = false;
  saving = false;

  studentSubjectStatistic : StudentSubjectStatistic = new StudentSubjectStatistic();
  studentPracticeList: StudentPractice[] = [];
  studentTestingList: StudentTesting[] = [];
  userId;
  loading: boolean = true;

  constructor(private studentSubjectService:StudentSubjectServiceService,
    private studentPracticeService: StudentPracticeService,
    private studentTestingService: StudentTestingService) {  
  }

  ngOnInit(): void {
    this.userId = this.getCurrentUserId();
    this.getAllStudentPractice();
    this.getAllStudentTesting();
    this.studentSubjectStatistic = new StudentSubjectStatistic();
    this.studentSubjectStatistic.practiceList = [];
    this.studentSubjectStatistic.testList = [];
  }

  getCurrentUserId(){
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    var userId = payLoad.UserID;
    return userId;
  }

  getAllStudentPractice(){
    this.studentPracticeService.getAll('').subscribe((res:StudentPractice[])=>{
      this.studentPracticeList = res;
    });
  }

  getAllStudentTesting(){
    this.studentTestingService.getAllForStudent().subscribe((res:StudentTesting[])=>{
      this.studentTestingList = res;
    });
  }

  show(id): void {
    this.studentSubjectService.getStudentSubjectStatistic(id).subscribe((res:StudentSubjectStatistic)=>{
      this.studentSubjectStatistic = res;
      this.loading = false;
    });
      this.active = true;
      this.modal.show();
  }

  close(): void {
      this.active = false;
      this.modal.hide();
  }

  getPracticeScore(practiceId){
    var res = 0.0;
    for(var i of this.studentPracticeList){
      if(i.practiceId == practiceId && i.studentId == this.userId)
        res = i.practiceScore;
    }
    return res;
  }

  getTestScore(testId){
    var res = 0.0;
    for(var i of this.studentTestingList){
      if(i.testId == testId && i.studentId == this.userId && i.isTested == true)
        res = i.testScore;
    }
    return res;
  }
}
