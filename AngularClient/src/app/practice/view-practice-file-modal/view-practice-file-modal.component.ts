import { Component, OnInit,ViewChild,Output,EventEmitter,Injector  } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Lecture } from 'src/app/models/Lecture';
import { Practice } from 'src/app/models/Practice';

@Component({
  selector: 'app-view-practice-file-modal',
  templateUrl: './view-practice-file-modal.component.html',
  styleUrls: ['./view-practice-file-modal.component.css']
})
export class ViewPracticeFileModalComponent{

  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item : Practice;
    file = [];


    constructor() {
      this.item = new Practice();
      this.file = [];
    }

    show(i:Practice): void {
        this.item = i;
        let name = i.name;
        this.file = this.item.practiceFiles;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

}
