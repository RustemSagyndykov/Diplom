import { Component, OnInit,ViewChild,Output,EventEmitter,Injector  } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Lecture } from 'src/app/models/Lecture';

@Component({
  selector: 'app-view-lecture-modal',
  templateUrl: './view-lecture-modal.component.html',
  styleUrls: ['./view-lecture-modal.component.css']
})
export class ViewLectureModalComponent{

  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item : Lecture;
    file = [];


    constructor() {
      this.item = new Lecture();
      this.file = [];
    }

    show(i:Lecture): void {
        this.item = i;
        let name = i.name;
        this.file = this.item.lectureFiles;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

}
