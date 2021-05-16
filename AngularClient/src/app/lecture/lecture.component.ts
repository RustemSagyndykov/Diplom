import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Lecture } from '../models/Lecture';
import { LectureFile } from '../models/LectureFile';
import { LectureService } from '../shared/lectureService/lecture.service';
import { ToastrService } from 'ngx-toastr';
import { Router,ActivatedRoute } from '@angular/router';
import { TestLookupTableModalComponent } from '../common/test-lookup-table-modal/test-lookup-table-modal.component';
import { SubjectLookupTableModalComponent } from '../common/subject-lookup-table-modal/subject-lookup-table-modal.component';
import { PracticeLookupTableModalComponent } from '../common/practice-lookup-table-modal/practice-lookup-table-modal.component';
import { StudentPractice } from '../models/StudentPractice';
import { StudentPracticeService } from '../shared/studentPracticeService/student-practice.service';
import { ViewPracticeModalComponent } from '../practice/view-practice-modal/view-practice-modal.component';
import { UserRole } from '../models/Roles';
import { ViewTestModalComponent } from '../test/view-test-modal/view-test-modal.component';

@Component({
  selector: 'app-lecture',
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.css']
})
export class LectureComponent implements OnInit {


  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '300px',
      maxHeight: '500px',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
};


  constructor(
    private service:LectureService,
    private toastr: ToastrService,
    private router: Router,
    public _activatedRoute: ActivatedRoute,
    private studentPracticeService: StudentPracticeService
    ) { 
      this.lectureId = this._activatedRoute.snapshot.queryParams['id'];
      this.editModeBool = this._activatedRoute.snapshot.queryParams['edit'];
  }

  @ViewChild('testLookupTableModal', { static: true }) testLookupTableModal: TestLookupTableModalComponent; 
  @ViewChild('subjectLookupTableModal', { static: true }) subjectLookupTableModal: SubjectLookupTableModalComponent; 
  @ViewChild('practiceLookupTableModal', { static: true }) practiceLookupTableModal: PracticeLookupTableModalComponent;
  @ViewChild('viewPracticeModal', { static: true }) viewPracticeModal: ViewPracticeModalComponent; 
  @ViewChild('viewTestModal', { static: true }) viewTestModal: ViewTestModalComponent;

  lecture: Lecture = new Lecture();
  lectureFiles:LectureFile[] = [];
  public response : {dbPath : ''}
  fileName = '';
  lectureId:number;
  viewMode = false;
  editMode = false;
  editModeBool: string ='';
  studentPracticeList: StudentPractice[] = [];
  userId;
  role;
  userRoles = UserRole;
  showLink=true;

  ngOnInit(): void {
    this.role = this.getUserRole();
    if(this.lectureId != null){
      this.editMode = Boolean(JSON.parse(this.editModeBool));
    }
    if(this.lectureId != null && this.editMode == false){
      this.viewMode = true;
      this.viewLecture();
      this.getAllStudentPractice();
      this.userId = this.getCurrentUserId();
    }else if(this.lectureId != null && this.editMode == true){
      this.viewMode = false;
      this.viewLecture();
    }

    this.setShowLink();
  }

  setShowLink(){
    if(this.role == this.userRoles.Admin || this.role == this.userRoles.Teacher){
      this.showLink = false;
    }
  }

  getAllStudentPractice(){
    this.studentPracticeService.getAll().subscribe((res:StudentPractice[])=>{
      this.studentPracticeList = res;
    });
  }

  getCurrentUserId(){
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    var userId = payLoad.UserID;
    return userId;
  }

  getUserRole(){
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    var userRole = payLoad.role;
    return userRole;
  }

  public uploadFinished = (event) =>{
    this.response = event;
    let l = new LectureFile();
    l.path  = this.response.dbPath;
    l.fileName = this.fileName;
    this.lectureFiles.push(l);
  }

  getFileName(event){
    this.fileName = '';
    this.fileName = event;
  }

  create(){
    this.lecture.lectureFiles = [];
    this.lecture.lectureFiles = this.lectureFiles;
    //this.service.createLecture(this.lecture).subscribe(
    this.service.createOrEdit(this.lecture).subscribe(
      (res: any) => {
      this.toastr.success('Saved!', 'Lecture saved successful.');
      this.router.navigateByUrl('/home/lectureList');}
    );
  }

  delete(fileName:string){
    this.lectureFiles = this.lectureFiles.filter(o => o.fileName !== fileName);
  }

  viewLecture(){
    this.service.getById(this.lectureId).subscribe((res:any)=>{
      this.lecture = res;
      this.lectureFiles = res.lectureFiles;
    });
  }

  openSelectTestModal(){
      this.testLookupTableModal.id = null;
			this.testLookupTableModal.displayName = '';
			this.testLookupTableModal.show();
  }

  selectTest(){
    this.lecture.testId = this.testLookupTableModal.id;
		this.lecture.testName = this.testLookupTableModal.displayName;
  }

  openSelectSubjectModal(){
    this.subjectLookupTableModal.id = null;
    this.subjectLookupTableModal.displayName = '';
    this.subjectLookupTableModal.show();
  }

  selectSubject(){
    this.lecture.subjectId = this.subjectLookupTableModal.id;
		this.lecture.subjectName = this.subjectLookupTableModal.displayName;
  }

  openSelectPracticeModal(){
    this.practiceLookupTableModal.id = null;
    this.practiceLookupTableModal.displayName = '';
    this.practiceLookupTableModal.show();
  }

  selectPractice(){
    this.lecture.practiceId = this.practiceLookupTableModal.id;
		this.lecture.practiceName = this.practiceLookupTableModal.displayName;
  }

  deletePractice(){
    this.lecture.practiceId = null;
		this.lecture.practiceName = null;
  }

  deleteTest(){
    this.lecture.testId = null;
		this.lecture.testName = null;
  }

  deleteSubject(){
    this.lecture.subjectId = null;
		this.lecture.subjectName = null;
  }

  RedirectToTest(){
    this.router.navigate(['/home/testing'], { queryParams: { id: this.lecture.testId} });
  }

  RedirectToPractice(){
    var StudentPracticeId = 0;
    for(var i of this.studentPracticeList){
      if(i.practiceId == this.lecture.practiceId && i.studentId == this.userId)
      StudentPracticeId = i.id;
    }
    this.router.navigate(['/home/studentPractice'], { queryParams: { id: this.lecture.practiceId, edit:true,studentPracticeId: StudentPracticeId } });
  }

  goBack(){
    if(this.role == this.userRoles.Admin || this.role == this.userRoles.Teacher){
      this.router.navigate(['/home/lectureList']);
    }else{
      this.router.navigate(['/home/studentLecture']);
    }
  }
}

