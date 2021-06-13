import { Component, OnInit,ViewChild} from '@angular/core';
import { Subject } from '../models/Subject';
import { SubjectService } from '../shared/subjectService/subject-service.service';
import { CreateOrEditSubjectComponent } from './create-or-edit-subject/create-or-edit-subject.component';
import { ToastrService } from 'ngx-toastr';
import { ViewSubjectModalComponent } from '../subject/view-subject-modal/view-subject-modal.component';
import { UserRole } from '../models/Roles';
import { StudentSubjectServiceService } from '../shared/studentSubjectService/student-subject-service.service';
import { StudentSubject } from '../models/StudentSubject';
import { SafeSubscriber } from 'rxjs/internal/Subscriber';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {

  subjectList:Subject[]=[];
  loading: boolean = true;
  role;
  userId;
  userRoles = UserRole;
  filterText='';
  studentSubjectList:StudentSubject[]=[]
  @ViewChild('createOrEditSubjectModal', { static: true }) createOrEditSubjectModal: CreateOrEditSubjectComponent;
  @ViewChild('viewSubjectModal', { static: true }) viewSubjectModal: ViewSubjectModalComponent; 

  constructor(private service: SubjectService,private studentSubjectService: StudentSubjectServiceService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.role = this.getUserRole();
    this.userId = this.getCurrentUserId();
    this.getAll();
    this.getAllStudentSubject();
  }

  getAll(){
    this.service.getAll(this.filterText).subscribe((res:Subject[])=>{
      this.subjectList =res;
      this.loading = false;
      console.log(this.subjectList);
    });
  }

  getUserRole(){
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    var userRole = payLoad.role;
    return userRole;
  }

  getCurrentUserId(){
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    var userId = payLoad.UserID;
    return userId;
  }

  create(){
    this.createOrEditSubjectModal.show();   
  }

  getSubject(){
    this.getAll();
  }

  deleteSubject(id:number){
    this.service.delete(id).subscribe(
      (res: any) => {
        this.getAll();
        this.toastr.success('Deleted!', 'Subject Deleted successful.');}
    );
  }

  compareIds(subjectId){
    var res = false;
    for( var i of this.studentSubjectList){
      if(i.subjectId == subjectId && i.isSubscribe == true && i.studentId == this.userId)
        res = true;
    }
    return res;
  }

  getAllStudentSubject(){
    this.studentSubjectService.getAll('').subscribe((res:StudentSubject[])=>{
      this.studentSubjectList = res;
    });
  }

  subscribeStudentToSubject(subject:Subject){
    var boolResult = false;
    var studentSub = new StudentSubject();

    for(var i of this.studentSubjectList){
      if(i.subjectId == subject.id && i.studentId == this.userId){
        studentSub = i;
        boolResult = true;
      }
    }

    if(boolResult == true){
      studentSub.isSubscribe = true;
    }
    else{
      studentSub.subjectId = subject.id;
      studentSub.isSubscribe = true;
    }

    this.studentSubjectService.createOrEdit(studentSub).subscribe(res=>{
      this.getAllStudentSubject();
      this.toastr.success('Подписано!', 'Пользователь был подписан на предмет.');
    });
  }

  unSubscribeStudentSubject(subject:Subject){
    var studentSub = new StudentSubject();

    for(var i of this.studentSubjectList){
      if(i.subjectId == subject.id && i.studentId == this.userId){
        studentSub = i;
        studentSub.isSubscribe = false;
      }
    }

    this.studentSubjectService.createOrEdit(studentSub).subscribe(res=>{
      this.getAllStudentSubject();
      this.toastr.success('Подписано!', 'Пользователь был отписан от предмета.');
    });

  }

  filterInput(event){
    if (event.key === 'Enter' || event.keyCode === 13) {
      this.getAll();
    }
  }

}
