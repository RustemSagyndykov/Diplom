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
    {path: 'lectureList', component: LectureListComponent, canActivate:[AuthGuard] }
  ]},
  //{path: 'forbidden', component: ForbiddenComponent},
  {path: 'adminpanel', component: AdminPanelComponent, canActivate:[AuthGuard], data: {permittedRoles:['Admin']}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
