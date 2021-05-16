import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Practice } from 'src/app/models/Practice';
import { StudentPractice } from 'src/app/models/StudentPractice';
import { PracticeService } from 'src/app/shared/practiceService/practice-service.service';
import { StudentPracticeService } from 'src/app/shared/studentPracticeService/student-practice.service';
import { ViewPracticeFileModalComponent } from '../view-practice-file-modal/view-practice-file-modal.component';

@Component({
  selector: 'app-student-practice-list',
  templateUrl: './student-practice-list.component.html',
  styleUrls: ['./student-practice-list.component.css']
})
export class StudentPracticeListComponent implements OnInit {

  practiceList:Practice[] = [];
  studentPracticeList: StudentPractice[] = [];
  loading: boolean = true;
  userId;

  @ViewChild('viewPracticeFileModal', { static: true }) viewPracticeFileModal: ViewPracticeFileModalComponent;

  constructor(private service: PracticeService ,private studentPracticeService: StudentPracticeService, private router: Router) { }

  ngOnInit(): void {
    this.userId = this.getCurrentUserId();
    this.getAll();
    this.getAllStudentPractice();
  }

  getAll(){
    this.service.getAllForStudent().subscribe((res:Practice[])=>{
      this.practiceList =res;
      this.loading = false;
    });
  }

  getAllStudentPractice(){
    this.studentPracticeService.getAll().subscribe((res:StudentPractice[])=>{
      this.studentPracticeList = res;
    });
  }

  getCurrentUserId(){
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    var userId = payLoad.UserID;
    return userId;
  }

  RedirectToPractice(Id:number){
    var StudentPracticeId = 0;
    for(var i of this.studentPracticeList){
      if(i.practiceId == Id && i.studentId == this.userId)
      StudentPracticeId = i.id;
    }
    this.router.navigate(['/home/studentPractice'], { queryParams: {id: Id, edit:true,studentPracticeId: StudentPracticeId} })/*.then(f => { location.reload(true) });*/
  }

  getPracticeScore(practiceId){
    var res = 0.0;
    for(var i of this.studentPracticeList){
      if(i.practiceId == practiceId && i.studentId == this.userId)
        res = i.practiceScore;
    }
    return res;
  }

  getPracticeStatus(practiceId){
    var res: string = '';
    for(var i of this.studentPracticeList){
      if(i.practiceId == practiceId && i.studentId == this.userId){
        if(i.isAccept == true)
          res = "isAccept";
        else if(i.isRevision == true)
          res = "isRevision";
        else
          res = "nothing";
      }
    }
    return res;
  }
}
