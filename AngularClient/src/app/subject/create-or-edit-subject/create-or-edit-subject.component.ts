import { Component, OnInit, ViewChild, Output,EventEmitter } from '@angular/core';
import { Subject } from '../../models/Subject';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SubjectService } from 'src/app/shared/subjectService/subject-service.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-or-edit-subject',
  templateUrl: './create-or-edit-subject.component.html',
  styleUrls: ['./create-or-edit-subject.component.css']
})
export class CreateOrEditSubjectComponent implements OnInit {

  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<Subject> = new EventEmitter<Subject>();

  active = false;
  saving = false;
  isValid = true;
  edit = false;

  subject: Subject = new Subject();
  subjectTemp: Subject = new Subject();

  constructor(private toastr: ToastrService, private service:SubjectService) { }

  ngOnInit(): void {
    this.subject = new Subject();
  }

  show(subject?: Subject): void { 
    this.edit = false;
    
    if (!subject) {
        this.subject = new Subject();

        this.active = true;
        this.modal.show();
    } else {
        this.service.getById(subject.id).subscribe((res:Subject)=>{
          this.subject = res;
          console.log(res);
        });
        //this.test = test;
        this.subjectTemp.name = subject.name;
        this.subjectTemp.creationTime = subject.creationTime;
        this.edit = true;
        this.active = true;
        this.modal.show();
    }
  }

  save(): void {
    this.saving = true;

    this.service.CreateOrEdit(this.subject)
    .pipe(finalize(() => { this.saving = false;}))
    .subscribe(res =>{
      this.toastr.success('Saved!', 'Subject Saved successful.');
      this.close();
      this.modalSave.emit(null);
    });
  }

  close(): void {
    if(this.edit == true && this.saving == false){
      this.subject.name = this.subjectTemp.name;
      this.subject.creationTime = this.subject.creationTime;
    }
        
    this.active = false;
    this.modal.hide();
  }

}
