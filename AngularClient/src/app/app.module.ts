import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { UserService } from './shared/user.service';
import { LoginComponent } from './user/login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
// import { FormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { ru_RU } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import ru from '@angular/common/locales/ru';
import { CabinetComponent } from './cabinet/cabinet.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileDownloadComponent } from './file-download/file-download.component';
import { FileDownloadService } from './shared/fileService/file-download.service'; 
import { LectureService } from './shared/lectureService/lecture.service'; 
import { AngularEditorModule } from '@kolkov/angular-editor';
import { LectureComponent } from './lecture/lecture.component';
import { LectureListComponent } from './lecture/lecture-list/lecture-list.component';
import { TableModule } from 'primeng/table';
import { ViewLectureModalComponent } from './lecture/view-lecture-modal/view-lecture-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TestComponent } from './test/test.component';
import { TestListComponent } from './test/test-list/test-list.component';
import { TestService } from './shared/TestService/test-service.service';
import { CreateOrEditTestComponent } from './test/create-or-edit-test/create-or-edit-test.component';
import { TestingComponent } from './test/testing/testing.component';
import { ViewTestModalComponent } from './test/view-test-modal/view-test-modal.component';
import { SubjectComponent } from './subject/subject.component';
import { SubjectService } from './shared/subjectService/subject-service.service';
import { CreateOrEditSubjectComponent } from './subject/create-or-edit-subject/create-or-edit-subject.component';
import { ViewSubjectModalComponent } from './subject/view-subject-modal/view-subject-modal.component';
import { UsersComponent } from './admin/users/users.component';
import { CreateOrEditUsersModalComponent } from './admin/users/create-or-edit-users-modal/create-or-edit-users-modal.component';
import { ViewUsersModalComponent } from './admin/users/view-users-modal/view-users-modal.component';
import { StudentPracticeListComponent } from './practice/student-practice-list/student-practice-list.component';
import { PracticeListComponent } from './practice/practice-list/practice-list.component';
import { PracticeService } from './shared/practiceService/practice-service.service';
import { CreateOrEditPracticeModalComponent } from './practice/create-or-edit-practice-modal/create-or-edit-practice-modal.component';
import { ViewPracticeFileModalComponent } from './practice/view-practice-file-modal/view-practice-file-modal.component';
import { ViewPracticeModalComponent } from './practice/view-practice-modal/view-practice-modal.component';
import { TestLookupTableModalComponent } from './common/test-lookup-table-modal/test-lookup-table-modal.component';
import { SubjectLookupTableModalComponent } from './common/subject-lookup-table-modal/subject-lookup-table-modal.component';
import { PracticeLookupTableModalComponent } from './common/practice-lookup-table-modal/practice-lookup-table-modal.component';
import { StudentSubjectServiceService } from './shared/studentSubjectService/student-subject-service.service';
import { StudentSubjectComponent } from './student-subject/student-subject.component';
import { StudentLectureComponent } from './lecture/student-lecture/student-lecture.component';
import { StudentTestComponent } from './test/student-test/student-test.component';
import { StudentTestingService } from './shared/studentTestingService/student-testing-service.service';
import { StudentPracticeComponent } from './practice/student-practice/student-practice.component';
import { StudentPracticeService } from './shared/studentPracticeService/student-practice.service';
import { StudentPracticeListForTeacherComponent } from './practice/student-practice-list-for-teacher/student-practice-list-for-teacher.component';
import { CommentService } from './shared/commentService/comment.service';
import { CommentComponent } from './comment/comment.component';
import { StudentSubjectStatisticModalComponent } from './subject/student-subject-statistic-modal/student-subject-statistic-modal.component';

registerLocaleData(ru);

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    RegistrationComponent,
    LoginComponent,
    HomeComponent,
    AdminPanelComponent,
    ForbiddenComponent,
    CabinetComponent,
    FileUploadComponent,
    FileDownloadComponent,
    LectureComponent,
    LectureListComponent,
    ViewLectureModalComponent,
    TestComponent,
    TestListComponent,
    CreateOrEditTestComponent,
    TestingComponent,
    ViewTestModalComponent,
    SubjectComponent,
    CreateOrEditSubjectComponent,
    ViewSubjectModalComponent,
    UsersComponent,
    CreateOrEditUsersModalComponent,
    ViewUsersModalComponent,
    StudentPracticeListComponent,
    PracticeListComponent,
    CreateOrEditPracticeModalComponent,
    ViewPracticeFileModalComponent,
    ViewPracticeModalComponent,
    TestLookupTableModalComponent,
    SubjectLookupTableModalComponent,
    PracticeLookupTableModalComponent,
    StudentSubjectComponent,
    StudentLectureComponent,
    StudentTestComponent,
    StudentPracticeComponent,
    StudentPracticeListForTeacherComponent,
    CommentComponent,
    StudentSubjectStatisticModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularEditorModule,
    TableModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot(),
    FormsModule
  ],
  providers: [
    UserService,
    FileDownloadService,
    LectureService, 
    TestService,
    SubjectService,
    PracticeService,
    StudentSubjectServiceService,
    StudentTestingService,
    StudentPracticeService,
    CommentService,{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },{ provide: NZ_I18N, useValue: ru_RU }],
  bootstrap: [AppComponent]
})
export class AppModule { }
