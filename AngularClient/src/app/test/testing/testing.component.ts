import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRole } from 'src/app/models/Roles';
import { StudentTesting } from 'src/app/models/StudentTesting';
import { Test } from 'src/app/models/Test';
import { TestQuestion } from 'src/app/models/Testquestion';
import { StudentTestingService } from 'src/app/shared/studentTestingService/student-testing-service.service';
import { TestService } from 'src/app/shared/TestService/test-service.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.css']
})
export class TestingComponent implements OnInit {

  test: Test = new Test();
  testTrue : Test = new Test();
  loading: boolean = true;
  bal;
  testId:number;
  studentTessting: StudentTesting = new StudentTesting();
  studentTestingList: StudentTesting[] = [];
  userId;
  role;
  userRoles = UserRole;

  constructor(private service:TestService,
    private studentTestingService: StudentTestingService,
    public _activatedRoute: ActivatedRoute,
    private router: Router) {
    this.testId = this._activatedRoute.snapshot.queryParams['id'];
   }

  ngOnInit(): void {
    if(this.testId != null){
      this.getAllStudentTesting();
      this.getTest();
      this.userId = this.getCurrentUserId();
      this.role = this.getUserRole();
    }
  }

  getTest(){
    this.service.getById(this.testId).subscribe((res:Test)=>{
      this.test = res;
      //this.testTrue = this.test;
      this.resetTrueAnswers();
      this.loading = false;
    });
  }

  getAllStudentTesting(){
    this.studentTestingService.getAllForStudent().subscribe((res:StudentTesting[])=>{
      this.studentTestingList = res;
    });
  }

  getCurrentUserId(){
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    var userId = payLoad.UserID;
    return userId;
  }

  getUserRole(){
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    var userRole = payLoad.role;
    return userRole;
  }

  resetTrueAnswers(){
    this.test.testQuestions.forEach(q => {
      q.testQuestionAnswer.forEach(a=>{
        a.isCorrect = false;
      });
    });
  }

  checkTest(){
    return this.service.checkTest(this.test);
  }
  
  finishTest(){
    this.bal = 0.0;
    let testStatus = '';
    this.checkTest().subscribe((res:number)=>{
      this.bal = res;
      this.createStudentTesting(this.test, this.bal);
      
      if(this.bal >=90){
        testStatus = 'EXCELLENT';
      }else if(this.bal >= 70){
        testStatus = 'GOOD';
      }else if(this.bal >= 50){
        testStatus = 'SATISFACTORY';
      }else{
        testStatus = "BAD";
      }

      this.alertTest(this.bal,testStatus);
    });
  }

  createStudentTesting(test:Test, bal:number){
    var boolResult = false;
    var studentTessting = new StudentTesting();

    for(var i of this.studentTestingList){
      if(i.testId == test.id && i.studentId == this.userId && i.isTested == true){
        studentTessting = i;
        boolResult = true;
      }
    }

    if(boolResult == true){
      studentTessting.testScore = bal;
    }
    else{
      studentTessting.testId = test.id;
      studentTessting.testScore = bal;
    }

    this.studentTestingService.createOrEdit(studentTessting).subscribe(res=>{
      
    });
  }

  alertTest(bal:number, testStatus: string){
    let status: string = '';
    let Icon;
    if(testStatus == "EXCELLENT"){
      status = 'Тест был пройден на отлично!';
      Icon = 'success';
    }else if(testStatus == "GOOD"){
      status = 'Тест был пройден хорошо!';
      Icon = 'success';
    }else if(testStatus == "SATISFACTORY"){
      status = 'Тест был пройден удовлетворительно!';
      Icon = 'info';
    }else{
      status = 'Тест был пройден плохо!';
      Icon = 'warning';
    }
    Swal.fire({
      title: status,
      text: 'Тест был пройден на' + ' ' + bal.toFixed(1) +' баллов',
      icon: Icon,
      showCancelButton: true,
      confirmButtonText: 'Ок',
      cancelButtonText: 'Пройти тест заново',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#28A745',
    }).then((result) => {
      if (result.value) {
        if(this.role == this.userRoles.Admin || this.role == this.userRoles.Teacher){
          this.router.navigate(['/home/testList']);
        }else{
          this.router.navigate(['/home/studentTest']);
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        location.reload(true);
      }
    })
  }

  goBack(){
    if(this.role == this.userRoles.Admin || this.role == this.userRoles.Teacher){
      this.router.navigate(['/home/testList']);
    }else{
      this.router.navigate(['/home/studentTest']);
    }
  }

}
