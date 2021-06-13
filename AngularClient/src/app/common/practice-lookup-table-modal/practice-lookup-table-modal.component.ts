import { Component, OnInit, ViewChild, Output,EventEmitter } from '@angular/core';
import { Practice } from '../../models/Practice';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PracticeService } from 'src/app/shared/practiceService/practice-service.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { PracticeFile } from 'src/app/models/PracticiFile';

@Component({
  selector: 'app-practice-lookup-table-modal',
  templateUrl: './practice-lookup-table-modal.component.html',
  styleUrls: ['./practice-lookup-table-modal.component.css']
})
export class PracticeLookupTableModalComponent implements OnInit {
  
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    id: number;
    displayName: string;
    practiceList:Practice[] = [];
    loading: boolean = true;
    filterText='';
    
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    saving = false;

    constructor(private service: PracticeService) {}

    ngOnInit(): void {
      this.getAll();
    }

    show(): void {
        this.filterText='';
        this.active = true;
        this.getAll();
        this.modal.show();
    }

    getAll(){
      this.service.getAllForLookupTable(this.filterText).subscribe((res:Practice[])=>{
        this.practiceList =res;
        this.loading = false;
        console.log(this.practiceList);
      });
    }


    setAndSave(test: Practice) {
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

    filterInput(event){
      if (event.key === 'Enter' || event.keyCode === 13) {
        this.getAll();
      }
    }
}
