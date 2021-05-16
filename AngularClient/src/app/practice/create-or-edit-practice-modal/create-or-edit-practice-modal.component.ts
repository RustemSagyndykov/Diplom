import { Component, OnInit, ViewChild, Output,EventEmitter } from '@angular/core';
import { Practice } from '../../models/Practice';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PracticeService } from 'src/app/shared/practiceService/practice-service.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { PracticeFile } from 'src/app/models/PracticiFile';
import { SubjectLookupTableModalComponent } from 'src/app/common/subject-lookup-table-modal/subject-lookup-table-modal.component';

@Component({
  selector: 'app-create-or-edit-practice-modal',
  templateUrl: './create-or-edit-practice-modal.component.html',
  styleUrls: ['./create-or-edit-practice-modal.component.css']
})
export class CreateOrEditPracticeModalComponent implements OnInit {

  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @ViewChild('subjectLookupTableModal', { static: true }) subjectLookupTableModal: SubjectLookupTableModalComponent; 
  @Output() modalSave: EventEmitter<Practice> = new EventEmitter<Practice>();

  active = false;
  saving = false;
  isValid = true;
  edit = false;
  public response : {dbPath : ''}
  fileName = '';

  practice: Practice = new Practice();
  practiceTemp: Practice = new Practice();

  constructor(private toastr: ToastrService, private service:PracticeService) { }

  ngOnInit(): void {
    this.practice = new Practice();
    this.practice.practiceFiles = [];
  }

  show(practice?: Practice): void { 
    this.edit = false;
    
    if (!practice) {
        this.practice = new Practice();
        this.practice.practiceFiles = [];

        this.active = true;
        this.modal.show();
    } else {
        this.service.getById(practice.id).subscribe((res:Practice)=>{
          this.practice = res;
          console.log(res);
        });
        //this.test = test;
        this.practiceTemp.name = practice.name;
        this.practiceTemp.practiceFiles = practice.practiceFiles;
        this.practiceTemp.subjectId = practice.subjectId;
        this.practiceTemp.subjectName = practice.subjectName;
        this.edit = true;
        this.active = true;
        this.modal.show();
    }
  }

  public uploadFinished = (event) =>{
    this.response = event;
    let p = new PracticeFile();
    p.path  = this.response.dbPath;
    p.fileName = this.fileName;
    this.practice.practiceFiles.push(p);
  }

  getFileName(event){
    this.fileName = '';
    this.fileName = event;
  }

  delete(fileName:string){
    this.practice.practiceFiles = this.practice.practiceFiles.filter(o => o.fileName !== fileName);
  }

  save(): void {
    this.saving = true;

    this.service.CreateOrEdit(this.practice)
    .pipe(finalize(() => { this.saving = false;}))
    .subscribe(res =>{
      this.toastr.success('Saved!', 'Practice Saved successful.');
      this.close();
      this.modalSave.emit(null);
    });
  }

  close(): void {
    if(this.edit == true && this.saving == false){
      this.practice.name = this.practiceTemp.name;
      this.practice.practiceFiles = this.practiceTemp.practiceFiles;
      this.practice.subjectId = this.practiceTemp.subjectId;
      this.practice.subjectName = this.practiceTemp.subjectName;
    }
        
    this.active = false;
    this.modal.hide();
  }

  openSelectSubjectModal(){
    this.subjectLookupTableModal.id = null;
    this.subjectLookupTableModal.displayName = '';
    this.subjectLookupTableModal.show();
  }

  selectSubject(){
    this.practice.subjectId = this.subjectLookupTableModal.id;
		this.practice.subjectName = this.subjectLookupTableModal.displayName;
  }

  deleteSubject(){
    this.practice.subjectId = null;
		this.practice.subjectName = null;
  }
}
