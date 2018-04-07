import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './routing.module';
import { HttpModule } from '@angular/http';

import { FlashMessagesModule } from 'angular2-flash-messages';

import { AppComponent } from './app.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { HomeComponent } from './component/home/home.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { RegisterComponent } from './component/register/register.component';

import { AuthService } from './services/auth.service';
import { BlogService } from './services/blog.service';

import { LoginComponent } from './component/login/login.component';
import { ProfileComponent } from './component/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { BlogComponent } from './component/blog/blog.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    BlogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    FlashMessagesModule.forRoot()
  ],
  providers: [
    AuthService,
    BlogService,
    AuthGuard,
    NotAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
