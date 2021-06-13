import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentTesting } from 'src/app/models/StudentTesting';
import { Test } from 'src/app/models/Test';
import { StudentTestingService } from 'src/app/shared/studentTestingService/student-testing-service.service';
import { TestService } from 'src/app/shared/TestService/test-service.service';

@Component({
  selector: 'app-student-test',
  templateUrl: './student-test.component.html',
  styleUrls: ['./student-test.component.scss']
})
export class StudentTestComponent implements OnInit {

  testList:Test[] = [];
  studentTestingList: StudentTesting[] = [];
  loading: boolean = true;
  userId;
  filterText='';

  constructor(private service: TestService,private studentTestingService: StudentTestingService,private router: Router) { }

  ngOnInit(): void {
    this.userId = this.getCurrentUserId();
    this.getAll();
    this.getAllStudentTesting();
  }

  getAll(){
    this.service.getAllForStudent(this.filterText).subscribe((res:Test[])=>{
      this.testList =res;
      this.loading = false;
      console.log(this.testList);
    });
  }

  testing(id:number){
    this.router.navigate(['/home/testing'], { queryParams: { id: id} })/*.then(f => { location.reload(true) });*/
  }

  getCurrentUserId(){
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    var userId = payLoad.UserID;
    return userId;
  }

  getAllStudentTesting(){
    this.studentTestingService.getAllForStudent().subscribe((res:StudentTesting[])=>{
      this.studentTestingList = res;
    });
  }

  getTestScore(testId){
    var res = 0.0;
    for(var i of this.studentTestingList){
      if(i.testId == testId && i.studentId == this.userId && i.isTested == true)
        res = i.testScore;
    }
    return res;
  }

  getTestingStatus(testId){
    var res = false;
    for(var i of this.studentTestingList){
      if(i.testId == testId && i.studentId == this.userId && i.isTested == true)
        res = true;
    }
    return res;
  }

  filterInput(event){
    if (event.key === 'Enter' || event.keyCode === 13) {
      this.getAll();
    }
  }
}
