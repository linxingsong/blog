import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, FormBuilder, Validators, Form } from '@angular/forms';

import { FlashMessagesService } from 'angular2-flash-messages';

import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { VALID } from '@angular/forms/src/model';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  newPost: boolean = false;
  loadingBlogs: boolean = false;
  form: FormGroup;
  commentForm: FormGroup;
  processing: boolean = false;
  username: string;
  blogPosts: any;
  newComment: any[] =[];
  enableComments: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService,
    private flashMessage: FlashMessagesService
  ) {
    this.createNewBlogForm();
    this.createCommentForm();
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
    });
  }

  createCommentForm(){
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200)
      ])]
    });
  }

  enableFormNewBlogForm(){
    this.form.get('title').enable();
    this.form.get('body').enable();
  }

  disableFormNewBlogForm(){
    this.form.get('title').disable();
    this.form.get('body').disable();
  }

  enableCommentForm(){
    this.commentForm.get('comment').enable();
  }

  disableCommentForm(){
    this.commentForm.get('comment').disable();
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

  likeBlog(id){
    this.blogService.likeBlog(id).subscribe(data=>{
      this.getAllBlogs();
    });
  }

  dislikeBlog(id){
    this.blogService.dislikeBlog(id).subscribe(data=>{
      this.getAllBlogs();
    });
  }

  draftComment(id){
    this.commentForm.reset();
    this.newComment=[];
    this.newComment.push(id);
  }

  postComment(id){
    this.disableCommentForm();
    this.processing= true;
    const comment = this.commentForm.get('comment').value;
    this.blogService.postComment(id, comment).subscribe(data=>{
      this.getAllBlogs();
      const index = this.newComment.indexOf(id);
      this.newComment.splice(index, 1);
      this.enableCommentForm();
      this.commentForm.reset();
      this.processing = false;
      if(this.enableComments.indexOf(id)<0){
        this.expand(id);
      }
    });
  }

  cancelSubmission(id){
    const index = this.newComment.indexOf(id);
    this.newComment.splice(index, 1);
    this.commentForm.reset();
    this.enableCommentForm();
    this.processing = false;
  }

  expand(id){
    this.enableComments.push(id);
  }

  collapse(id){
    const index = this.enableComments.indexOf(id);
    this.enableComments.splice(index,1);
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile =>{
      this.username = profile.user.username;
    });
    this.getAllBlogs();
  }

}
