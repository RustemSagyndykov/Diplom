import { Component, OnInit, ViewChild } from '@angular/core';
import { PracticeService } from 'src/app/shared/practiceService/practice-service.service';
import { Practice } from '../../models/Practice';
import { CreateOrEditPracticeModalComponent } from '../create-or-edit-practice-modal/create-or-edit-practice-modal.component';
import { ToastrService } from 'ngx-toastr';
import { ViewPracticeFileModalComponent } from '../view-practice-file-modal/view-practice-file-modal.component';
import { ViewPracticeModalComponent } from '../view-practice-modal/view-practice-modal.component';

@Component({
  selector: 'app-practice-list',
  templateUrl: './practice-list.component.html',
  styleUrls: ['./practice-list.component.css']
})
export class PracticeListComponent implements OnInit {

  practiceList:Practice[] = [];
  loading: boolean = true;

  @ViewChild('createOrEditPracticeModal', { static: true }) createOrEditPracticeModal: CreateOrEditPracticeModalComponent;
  @ViewChild('viewPracticeFileModal', { static: true }) viewPracticeFileModal: ViewPracticeFileModalComponent;
  @ViewChild('viewPracticeModal', { static: true }) viewPracticeModal: ViewPracticeModalComponent;

  constructor(private service: PracticeService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    this.service.getAll().subscribe((res:Practice[])=>{
      this.practiceList =res;
      this.loading = false;
      console.log(this.practiceList);
    });
  }

  createPractice(){
      this.createOrEditPracticeModal.show();   
  }
  
  getPractice(){
    this.getAll();
  }

  deletePracticeItem(id:number){
    this.service.delete(id).subscribe(
      (res: any) => {
        this.getAll();
        this.toastr.success('Deleted!', 'Practice Deleted successful.');}
    );
  }

}
