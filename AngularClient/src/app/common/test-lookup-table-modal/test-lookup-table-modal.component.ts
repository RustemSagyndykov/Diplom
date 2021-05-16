import { Component, OnInit, ViewChild, Output,EventEmitter } from '@angular/core';
import { Practice } from '../../models/Practice';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PracticeService } from 'src/app/shared/practiceService/practice-service.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { PracticeFile } from 'src/app/models/PracticiFile';
import { TestService } from 'src/app/shared/TestService/test-service.service';
import { Test } from 'src/app/models/Test';

@Component({
  selector: 'app-test-lookup-table-modal',
  templateUrl: './test-lookup-table-modal.component.html',
  styleUrls: ['./test-lookup-table-modal.component.css']
})
export class TestLookupTableModalComponent implements OnInit{

  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    id: number;
    displayName: string;
    testList:Test[] = [];
    loading: boolean = true;
    
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    saving = false;

    constructor(private service: TestService) {}

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
        this.testList =res;
        this.loading = false;
        console.log(this.testList);
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
