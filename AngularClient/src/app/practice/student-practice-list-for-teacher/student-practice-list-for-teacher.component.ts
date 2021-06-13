import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from 'src/app/models/Roles';
import { StudentPractice } from 'src/app/models/StudentPractice';
import { StudentPracticeService } from 'src/app/shared/studentPracticeService/student-practice.service';
import { ViewPracticeFileModalComponent } from '../view-practice-file-modal/view-practice-file-modal.component';

@Component({
  selector: 'app-student-practice-list-for-teacher',
  templateUrl: './student-practice-list-for-teacher.component.html',
  styleUrls: ['./student-practice-list-for-teacher.component.scss']
})
export class StudentPracticeListForTeacherComponent implements OnInit {

  practiceList:StudentPractice[] = [];
  loading: boolean = true;
  role;
  userRoles = UserRole;
  filterText='';

  @ViewChild('viewPracticeFileModal', { static: true }) viewPracticeFileModal: ViewPracticeFileModalComponent;

  constructor(private service: StudentPracticeService, private router: Router) { }

  ngOnInit(): void {
    this.role = this.getUserRole();
    this.getAll();
  }

  getUserRole(){
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    var userRole = payLoad.role;
    return userRole;
  }

  getAll(){
    if(this.role == this.userRoles.Admin){
      this.service.getAll(this.filterText).subscribe((res:StudentPractice[])=>{
        this.practiceList =res;
        this.loading = false;
      });
    }
    else{
      this.service.getAllForTeacher(this.filterText).subscribe((res:StudentPractice[])=>{
        this.practiceList =res;
        this.loading = false;
      });
    }
  }

  RedirectToStudentPractice(Id:number,StudentPracticeId : number){
    this.router.navigate(['/home/studentPractice'], { queryParams: { id: Id, edit:false, studentPracticeId: StudentPracticeId} })/*.then(f => { location.reload(true) });*/
  }

  filterInput(event){
    if (event.key === 'Enter' || event.keyCode === 13) {
      this.getAll();
    }
  }
}
