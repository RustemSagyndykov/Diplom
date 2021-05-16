import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Practice } from 'src/app/models/Practice';
import { PracticeService } from 'src/app/shared/practiceService/practice-service.service';

@Component({
  selector: 'app-view-practice-modal',
  templateUrl: './view-practice-modal.component.html',
  styleUrls: ['./view-practice-modal.component.css']
})
export class ViewPracticeModalComponent{

  @ViewChild('viewModal', { static: true }) modal: ModalDirective;

    active = false;
    saving = false;

    practice : Practice = new Practice();


    constructor(private service:PracticeService) {
      this.practice = new Practice();
      this.practice.practiceFiles = [];
    }

    show(id): void {
      this.service.getById(id).subscribe((res:Practice)=>{
        this.practice = res;
      });
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

}
