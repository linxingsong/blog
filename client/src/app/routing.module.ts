import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { HomeComponent } from './component/home/home.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { RegisterComponent } from './component/register/register.component';
import { LoginComponent } from './component/login/login.component';
import { ProfileComponent } from './component/profile/profile.component';
import { BlogComponent } from './component/blog/blog.component';
import { EditBlogComponent } from './component/blog/edit-blog/edit-blog.component'


import { AuthGuard } from '../app/guards/auth.guard';
import { NotAuthGuard } from '../app/guards/notAuth.guard';
import { DeleteBlogComponent } from './component/blog/delete-blog/delete-blog.component';
import { PublicProfileComponent } from './component/public-profile/public-profile.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent },
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [NotAuthGuard]},
  {path: 'login', component: LoginComponent, canActivate: [NotAuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'user/:username', component: PublicProfileComponent, canActivate: [AuthGuard]},
  {path: 'blogs', component: BlogComponent, canActivate: [AuthGuard]},
  {path: 'edit-blog/:id', component: EditBlogComponent, canActivate: [AuthGuard]},
  {path: 'delete-blog/:id', component: DeleteBlogComponent, canActivate: [AuthGuard]},
  {path: '**', component: HomeComponent}
];

@NgModule({
  declarations: [

  ],
  imports: [
   RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }