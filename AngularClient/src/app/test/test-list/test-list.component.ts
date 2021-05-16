import { Component, OnInit, ViewChild } from '@angular/core';
import { TestService } from 'src/app/shared/TestService/test-service.service';
import { Test } from 'src/app/models/Test';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreateOrEditTestComponent } from '../create-or-edit-test/create-or-edit-test.component';
import { ViewTestModalComponent } from '../view-test-modal/view-test-modal.component';
import { UserRole } from 'src/app/models/Roles';
 
@Component({
  selector: 'app-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.css']
})
export class TestListComponent implements OnInit {

  constructor(private service: TestService,private router: Router,private toastr: ToastrService) { }

  testList:Test[] = [];
  test: Test = new Test();
  loading: boolean = true;
  role;
  userRoles = UserRole;
  @ViewChild('createOrEditTestModal', { static: true }) createOrEditTestModal: CreateOrEditTestComponent;
  @ViewChild('viewTestModal', { static: true }) viewTestModal: ViewTestModalComponent;   

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
      this.service.getAll().subscribe((res:Test[])=>{
        this.testList =res;
        this.loading = false;
      });
    }
    else{
      this.service.getAllforUser().subscribe((res:Test[])=>{
        this.testList =res;
        this.loading = false;
      });
    }
  }

  createTest(){
    this.router.navigateByUrl('/home/test');
    //window.open('/home/lecture', "_blank");
  }

  viewTest(id:number){
    this.router.navigate(['/home/lecture'], { queryParams: { id: id, edit:false } }).then(f => { location.reload(true) });
  }

  editTest(id:number){
    this.router.navigate(['/home/lecture'], { queryParams: { id: id, edit:true } }).then(f => { location.reload(true) });
  }

  testing(id:number){
    this.router.navigate(['/home/testing'], { queryParams: { id: id} })/*.then(f => { location.reload(true) });*/
  }

  deleteTestItem(id:number){
    this.service.delete(id).subscribe(
      (res: any) => {
        this.getAll();
        this.toastr.success('Deleted!', 'Test Deleted successful.');}
    );
  }

  create(){
    this.createOrEditTestModal.show();   
  }

  getTests(event?){
    this.service.getAllforUser().subscribe((res:Test[]) =>{
      this.testList = res;
    });
  }

  getTest(event?){

    if(this.testList.length == 0){
      this.testList[0] = event;
      this.testList[0].id = 1;
    }
    else if(this.testList.find( t => t.id == event.id))
      this.updateTest(event);
    else{
      let t = this.addTest(event);
      this.testList.push(t);
    }
  }

  updateTest(test){
    this.testList.forEach(k => {
      if(k.id == test.id){
        k = test;
      }
    });
  }

  addTest(test){
    let max = 0;
    this.testList.forEach(k => {
      if(k.id >max){
        max = k.id
      }
    });

    test.id = max + 1;
    
    return test;
  }

}
