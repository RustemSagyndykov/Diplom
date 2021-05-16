import { Component, OnInit, ViewChild, Output,EventEmitter } from '@angular/core';
import { Practice } from '../../models/Practice';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PracticeService } from 'src/app/shared/practiceService/practice-service.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { PracticeFile } from 'src/app/models/PracticiFile';
import { SubjectService } from 'src/app/shared/subjectService/subject-service.service';
import { Test } from 'src/app/models/Test';

@Component({
  selector: 'app-subject-lookup-table-modal',
  templateUrl: './subject-lookup-table-modal.component.html',
  styleUrls: ['./subject-lookup-table-modal.component.css']
})
export class SubjectLookupTableModalComponent implements OnInit {

  
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    id: number;
    displayName: string;
    subjectList:Test[] = [];
    loading: boolean = true;
    
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    saving = false;

    constructor(private service: SubjectService) {}

    ngOnInit(): void {
      this.getAll();
    }

    show(): void {
        this.active = true;
        this.getAll();
        this.modal.show();
    }

    getAll(){
      this.service.getAll().subscribe((res:Test[])=>{
        this.subjectList =res;
        this.loading = false;
        console.log(this.subjectList);
      });
    }


    setAndSave(test: Test) {
        this.id = test.id;
        this.displayName = test.name;
        this.active = false;
        this.modal.hide();
        this.modalSave.emit(test);
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

}
