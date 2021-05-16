import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timestamp } from 'rxjs/operators';
import { Practice } from 'src/app/models/Practice';
import { UserRole } from 'src/app/models/Roles';
import { StudentPracticeFile } from 'src/app/models/StudentPracticeFile';
import { PracticeService } from 'src/app/shared/practiceService/practice-service.service';
import { StudentPracticeService } from 'src/app/shared/studentPracticeService/student-practice.service';
import { StudentPractice } from '../../models/StudentPractice';

@Component({
  selector: 'app-student-practice',
  templateUrl: './student-practice.component.html',
  styleUrls: ['./student-practice.component.css']
})
export class StudentPracticeComponent implements OnInit {

  practice: Practice = new Practice();
  studentPractice: StudentPractice = new StudentPractice();
  practiceId:number;
  studentPracticeId: number;
  editModeBool: string ='';
  public response : {dbPath : ''}
  fileName = '';
  editMode = true;
  role;
  userRoles = UserRole;

  constructor(
    private service: PracticeService,
    private studentPracticeService: StudentPracticeService,
    public activatedRoute: ActivatedRoute,
    private router: Router) {
      this.practiceId = this.activatedRoute.snapshot.queryParams['id'];
      this.editModeBool = this.activatedRoute.snapshot.queryParams['edit'];
      this.studentPracticeId = this.activatedRoute.snapshot.queryParams['studentPracticeId'];
   }

  ngOnInit(): void {
    this.role = this.getUserRole();
    this.editMode = Boolean(JSON.parse(this.editModeBool));
    this.practice.practiceFiles = [];
    this.studentPractice.practiceScore = 0.0;
    this.studentPractice.studentPracticeFiles = [];
    this.getPracticeById();
    if(this.studentPracticeId != null){
      this.getStudentPracticeForTeacherById();
    }
    else{
      this.getStudentPracticeById();
    }
  }

  getUserRole(){
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    var userRole = payLoad.role;
    return userRole;
  }

  getPracticeById(){
    this.service.getById(this.practiceId).subscribe((res:Practice)=>{
      this.practice =res;
    });
  }

  getStudentPracticeById(){
    this.studentPracticeService.getById(this.practiceId).subscribe((res:StudentPractice)=>{
      this.studentPractice =res;
    });
  }

  getStudentPracticeForTeacherById(){
    this.studentPracticeService.getByIdForTeacher(this.studentPracticeId).subscribe((res:StudentPractice)=>{
      this.studentPractice =res;
    });
  }

  public uploadFinished = (event) =>{
    this.response = event;
    let s = new StudentPracticeFile();
    s.path  = this.response.dbPath;
    s.fileName = this.fileName;
    this.studentPractice.studentPracticeFiles.push(s);
  }

  getFileName(event){
    this.fileName = '';
    this.fileName = event;
  }

  delete(fileName:string){
    this.studentPractice.studentPracticeFiles = this.studentPractice.studentPracticeFiles.filter(s => s.fileName !== fileName);
  }

  save(){
    this.studentPractice.practiceId = this.practice.id;
    this.studentPractice.isAccept = false;
    this.studentPractice.isRevision = false;
    this.studentPractice.practiceScore = 0;
    this.studentPracticeService.createOrEdit(this.studentPractice).subscribe(()=>{
      this.router.navigate(['/home/studentPracticeList']).then(f => { location.reload(true) });
    });
  }

  Accept(){
    this.studentPractice.practiceId = this.practice.id;
    this.studentPractice.isAccept = true;
    this.studentPractice.isRevision = false;
    this.studentPracticeService.createOrEdit(this.studentPractice).subscribe(()=>{
      this.router.navigate(['/home/studentPracticeListForTeacher']).then(f => { location.reload(true) });
    });
  }

  SetdToRevision(){
    this.studentPractice.practiceId = this.practice.id;
    this.studentPractice.isAccept = false;
    this.studentPractice.isRevision = true;
    this.studentPracticeService.createOrEdit(this.studentPractice).subscribe(()=>{
      this.router.navigate(['/home/studentPracticeListForTeacher']).then(f => { location.reload(true) });
    });
  }

  goBack(){
    if(this.role == this.userRoles.Admin || this.role == this.userRoles.Teacher){
      this.router.navigate(['/home/studentPracticeListForTeacher']);
    }else{
      this.router.navigate(['/home/studentPracticeList']);
    }
  }
}
