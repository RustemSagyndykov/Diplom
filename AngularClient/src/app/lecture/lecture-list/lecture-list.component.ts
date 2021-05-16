import { Component, OnInit,ViewChild } from '@angular/core';
import { Lecture } from 'src/app/models/Lecture';
import { LectureService } from 'src/app/shared/lectureService/lecture.service';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { ViewLectureModalComponent } from '../view-lecture-modal/view-lecture-modal.component';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { ToastrService } from 'ngx-toastr';
import { UserRole } from '../../models/Roles';

@Component({
  selector: 'app-lecture-list',
  templateUrl: './lecture-list.component.html',
  styleUrls: ['./lecture-list.component.css']
})
export class LectureListComponent implements OnInit {

  @ViewChild('viewLectureeModal', { static: true }) viewLectureeModal: ViewLectureModalComponent;   

  lectureList:Lecture[] = [];
  loading: boolean = true;
  role;
  userRoles = UserRole;

  constructor(private service: LectureService,private router: Router,private toastr: ToastrService) { }

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
      this.service.getAllForAdmin().subscribe((res:Lecture[])=>{
        this.lectureList =res;
        this.loading = false;
        console.log(this.lectureList);
      });
    }else{
      this.service.getAll().subscribe((res:Lecture[])=>{
        this.lectureList =res;
        this.loading = false;
        console.log(this.lectureList);
      });
    }
  }

  createLecture(){
    this.router.navigateByUrl('/home/lecture');
    //window.open('/home/lecture', "_blank");
  }

  viewLecture(id:number){
    this.router.navigate(['/home/lecture'], { queryParams: { id: id, edit:false } })/*.then(f => { location.reload(true) });*/
  }

  editLecture(id:number){
    this.router.navigate(['/home/lecture'], { queryParams: { id: id, edit:true } })/*.then(f => { location.reload(true) });*/
  }

  deleteLectureItem(id:number){
    this.service.delete(id).subscribe(
      (res: any) => {
        this.getAll();
        this.toastr.success('Deleted!', 'Lecture Deleted successful.');}
    );
  }
}
