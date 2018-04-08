import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, FormBuilder, Validators, Form } from '@angular/forms';

import { FlashMessagesService } from 'angular2-flash-messages';

import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  newPost: boolean = false;
  loadingBlogs: boolean = false;
  form: FormGroup;
  processing: boolean = false;
  username: string;
  blogPosts: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService,
    private flashMessage: FlashMessagesService
  ) {
    this.createNewBlogForm();
   }

  createNewBlogForm(){
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.blogTitleValidation
      ])],
      body: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])]
    })
  }

  enableFormNewBlogForm(){
    this.form.get('title').enable();
    this.form.get('body').enable();
  }

  disableFormNewBlogForm(){
    this.form.get('title').disable();
    this.form.get('body').disable();
  }

  blogTitleValidation(controls){
    const regExp = new RegExp(/^[a-zA-Z0-9!@#\$/%\^\&*\)\(+=.;_\'\"\"\'-]+$/);
    if(regExp.test(controls.value)){
      return null;
    } else {
      return { 'blogTitleValidation': true}
    }
  }

  newBlogForm(){
    this.newPost = true;
  }

  reloadBlog(){
    this.loadingBlogs = true;
    this.getAllBlogs();
    setTimeout(()=>{
      this.loadingBlogs = false;
    }, 4000);
  }

  draftComment(){

  }

  onNewBlogSubmit(){
    this.processing = true;
    this.disableFormNewBlogForm();
    const blog = {
      title: this.form.get('title').value,
      body: this.form.get('body').value,
      createdBy: this.username
    }
    this.blogService.newBlog(blog).subscribe(data=>{
      if(!data.success){
        this.flashMessage.show(data.message, {
          cssClass: 'alert-danger', timeout: 4000
        });
        this.processing = false;
        this.enableFormNewBlogForm();
      }else {
        this.flashMessage.show(data.message, {
          cssClass: 'alert-success', timeout: 4000
        });
        this.getAllBlogs();
        this.newPost = false;
        this.processing = false;
        this.form.reset();
        this.enableFormNewBlogForm();
      }
    })
  }

  goBack(){
    window.location.reload();
  }

  getAllBlogs(){
    this.blogService.getAllBlogs().subscribe( data =>{
      this.blogPosts = data.blog;
    });
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile =>{
      this.username = profile.user.username;
    });
    this.getAllBlogs();
  }

}
