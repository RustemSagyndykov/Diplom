import { Component, OnInit,ViewChild,Output,EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Test } from 'src/app/models/Test';
import { TestService } from 'src/app/shared/TestService/test-service.service';

@Component({
  selector: 'app-view-test-modal',
  templateUrl: './view-test-modal.component.html',
  styleUrls: ['./view-test-modal.component.css']
})
export class ViewTestModalComponent{

  @ViewChild('viewModal', { static: true }) modal: ModalDirective;

    active = false;
    saving = false;

    test : Test = new Test();


    constructor(private service:TestService) {
      this.test = new Test();
    }

    show(id): void {
      this.test.testQuestions=[];
      this.service.getById(id).subscribe((res:Test)=>{
        this.test = res;
      });
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

}
