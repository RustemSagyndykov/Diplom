import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subject } from 'src/app/models/Subject';
import { SubjectService } from 'src/app/shared/subjectService/subject-service.service';

@Component({
  selector: 'app-view-subject-modal',
  templateUrl: './view-subject-modal.component.html',
  styleUrls: ['./view-subject-modal.component.css']
})
export class ViewSubjectModalComponent{

  @ViewChild('viewModal', { static: true }) modal: ModalDirective;

    active = false;
    saving = false;

    subject : Subject = new Subject();


    constructor(private service:SubjectService) {
      this.subject = new Subject();
    }

    show(id): void {
      this.service.getById(id).subscribe((res:Subject)=>{
        this.subject = res;
      });
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

}
