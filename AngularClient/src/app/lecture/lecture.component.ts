import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Lecture } from '../models/Lecture';
import { LectureFile } from '../models/LectureFile';
import { LectureService } from '../shared/lectureService/lecture.service';
import { ToastrService } from 'ngx-toastr';
import { Router,ActivatedRoute } from '@angular/router';

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


  constructor(private service:LectureService,private toastr: ToastrService,private router: Router,public _activatedRoute: ActivatedRoute,) { 
    this.lectureId = this._activatedRoute.snapshot.queryParams['id'];
    this.editModeBool = this._activatedRoute.snapshot.queryParams['edit'];
  }

  lecture: Lecture = new Lecture();
  lectureFiles:LectureFile[] = [];
  public response : {dbPath : ''}
  fileName = '';
  lectureId:number;
  viewMode = false;
  editMode = false;
  editModeBool: string ='';

  ngOnInit(): void {
    if(this.lectureId != null){
      this.editMode = Boolean(JSON.parse(this.editModeBool));
    }
    if(this.lectureId != null && this.editMode == false){
      this.viewMode = true;
      this.viewLecture();
    }else if(this.lectureId != null && this.editMode == true){
      this.viewMode = false;
      this.viewLecture();
    }
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
}

