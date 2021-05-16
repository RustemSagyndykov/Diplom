import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Test } from 'src/app/models/Test';
import { ToastrService } from 'ngx-toastr';
import { TestQuestion } from 'src/app/models/Testquestion';
import { TestQuestionAnswer } from 'src/app/models/TestQuestionAnswer';
import { TestService } from 'src/app/shared/TestService/test-service.service';
import { finalize } from 'rxjs/operators';
import { SubjectLookupTableModalComponent } from 'src/app/common/subject-lookup-table-modal/subject-lookup-table-modal.component';

@Component({
  selector: 'app-create-or-edit-test',
  templateUrl: './create-or-edit-test.component.html',
  styleUrls: ['./create-or-edit-test.component.css']
})
export class CreateOrEditTestComponent implements OnInit {

  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @ViewChild('subjectLookupTableModal', { static: true }) subjectLookupTableModal: SubjectLookupTableModalComponent;
  @Output() modalSave: EventEmitter<Test> = new EventEmitter<Test>();

  active = false;
  saving = false;
  isValid = true;
  edit = false;

  test: Test = new Test();
  testTemp: Test = new Test();

  constructor(private toastr: ToastrService, private service:TestService) { }

  ngOnInit(): void {
    this.test.testQuestions = [];
  }

  show(test?: Test): void { 
    this.edit = false;
    
    if (!test) {
        this.test = new Test();
        this.test.testQuestions = [];

        this.active = true;
        this.modal.show();
    } else {
        this.service.getById(test.id).subscribe((res:Test)=>{
          this.test = res;
          console.log(res);
        });
        //this.test = test;
        this.testTemp.name = test.name;
        this.testTemp.testQuestions = test.testQuestions;
        this.testTemp.subjectId = test.subjectId;
        this.testTemp.subjectName = test.subjectName;
        this.edit = true;
        this.active = true;
        this.modal.show();
    }
  }

  save(): void {
    this.saving = true;

    //this.service.Create(this.test)
    this.service.CreateOrEdit(this.test)
    .pipe(finalize(() => { this.saving = false;}))
    .subscribe(res =>{
      this.toastr.success('Saved!', 'Test Saved successful.');
      this.close();
      this.modalSave.emit(null);
    });

    // this.modalSave.emit(this.test);
    // this.close();
    // this.saving = false;
    // this.toastr.success('Saved!', 'Test Saved successful.');
  }

  close(): void {
    if(this.edit == true && this.saving == false){
      this.test.name = this.testTemp.name;
      this.test.testQuestions = this.testTemp.testQuestions;
      this.test.subjectId = this.testTemp.subjectId;
      this.test.subjectName = this.testTemp.subjectName;
    }
        
    this.active = false;
    this.modal.hide();
  }

  addTestQuestuion(){
    var testQuestion = new TestQuestion();
    testQuestion.testQuestionAnswer = [];
    let max = 0;
     this.test.testQuestions.forEach(obj =>{
    if(obj.idForView >max){
      max = obj.idForView
    }
  });
    testQuestion.idForView = max+1;
    this.test.testQuestions.push(testQuestion);
    console.log(this.test.testQuestions);
  }

  addTestQuestuionAnswer(testQuestion:TestQuestion){
    var testQuestionAnswer = new TestQuestionAnswer();
    let max = 0;
     testQuestion.testQuestionAnswer.forEach(obj =>{
      if(obj.idForView >max){
        max = obj.idForView
      }
    });
    testQuestionAnswer.idForView = max+1;
    testQuestion.testQuestionAnswer.push(testQuestionAnswer);
    console.log(testQuestion.testQuestionAnswer);
  }

  deleteTestQuestionItem(item: TestQuestion){
    this.test.testQuestions = this.test.testQuestions.filter(obj => obj.idForView !== item.idForView);
    console.log(this.test.testQuestions);
  }

  deleteTestQuestionAnswerItem(item: TestQuestionAnswer, itemId){
    this.test.testQuestions[itemId].testQuestionAnswer = this.test.testQuestions[itemId].testQuestionAnswer.filter(obj => obj.idForView !== item.idForView);
    console.log(this.test.testQuestions);
  }

  openSelectSubjectModal(){
    this.subjectLookupTableModal.id = null;
    this.subjectLookupTableModal.displayName = '';
    this.subjectLookupTableModal.show();
  }

  selectSubject(){
    this.test.subjectId = this.subjectLookupTableModal.id;
		this.test.subjectName = this.subjectLookupTableModal.displayName;
  }

  deleteSubject(){
    this.test.subjectId = null;
		this.test.subjectName = null;
  }
}
