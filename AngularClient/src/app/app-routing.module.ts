import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './user/login/login.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from './auth/auth.guard';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { CabinetComponent } from './cabinet/cabinet.component';
import { LectureComponent } from './lecture/lecture.component';
import { LectureListComponent } from './lecture/lecture-list/lecture-list.component';
import { TestListComponent } from './test/test-list/test-list.component';
import { TestComponent } from './test/test.component';
import {TestingComponent} from './test/testing/testing.component';
import { SubjectComponent } from './subject/subject.component';
import { UsersComponent } from './admin/users/users.component';
import { PracticeListComponent } from './practice/practice-list/practice-list.component';
import { StudentSubjectComponent } from './student-subject/student-subject.component';
import { StudentLectureComponent } from './lecture/student-lecture/student-lecture.component';
import { StudentTestComponent } from './test/student-test/student-test.component';
import { StudentPracticeListComponent } from './practice/student-practice-list/student-practice-list.component';
import { StudentPracticeComponent } from './practice/student-practice/student-practice.component';
import { StudentPracticeListForTeacherComponent } from './practice/student-practice-list-for-teacher/student-practice-list-for-teacher.component';

const routes: Routes = [
  {path:'', redirectTo:'/user/login', pathMatch:'full'},
  {
    path: 'user', component:UserComponent,
    children:[
      {path: 'registration', component: RegistrationComponent},
      {path: 'login', component: LoginComponent}
    ]
  },
  {path: 'home', component: HomeComponent, canActivate:[AuthGuard],children:[
    {path: 'forbidden', component: ForbiddenComponent},
    {path: 'cabinet', component: CabinetComponent, canActivate:[AuthGuard] },
    {path: 'lecture', component: LectureComponent, canActivate:[AuthGuard] },
    {path: 'lectureList', component: LectureListComponent, canActivate:[AuthGuard] },
    {path: 'studentLecture', component: StudentLectureComponent, canActivate:[AuthGuard] },
    {path: 'testList', component: TestListComponent, canActivate:[AuthGuard] },
    {path: 'test', component: TestComponent, canActivate:[AuthGuard] },
    {path: 'studentTest', component: StudentTestComponent, canActivate:[AuthGuard] },
    {path: 'testing', component: TestingComponent, canActivate:[AuthGuard] },
    {path: 'subject', component: SubjectComponent, canActivate:[AuthGuard] },
    {path: 'studentSubject', component: StudentSubjectComponent, canActivate:[AuthGuard] },
    {path: 'practice', component: PracticeListComponent, canActivate:[AuthGuard] },
    {path: 'studentPracticeList', component: StudentPracticeListComponent, canActivate:[AuthGuard] },
    {path: 'studentPracticeListForTeacher', component: StudentPracticeListForTeacherComponent, canActivate:[AuthGuard] },
    {path: 'studentPractice', component: StudentPracticeComponent, canActivate:[AuthGuard] },
    {path: 'admin/users', component: UsersComponent, canActivate:[AuthGuard] }
  ]},
  //{path: 'forbidden', component: ForbiddenComponent},
  {path: 'adminpanel', component: AdminPanelComponent, canActivate:[AuthGuard], data: {permittedRoles:['Admin']}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
