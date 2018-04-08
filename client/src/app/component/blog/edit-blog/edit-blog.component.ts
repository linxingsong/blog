import { Component, OnInit } from '@angular/core';

import { FlashMessagesService } from 'angular2-flash-messages';
import { FormControl, FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';

import { BlogService } from '../../../services/blog.service';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {
  blog: any;

  processing: boolean = false;
  currentUrl;
  loading: boolean = true;

  constructor(
    private flashMessage: FlashMessagesService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService,
    private router: Router
  ) { }

  updateBlogSubmit(){
    this.processing = true;
    //update blog
    this.blogService.editBlog(this.blog).subscribe(data=>{
      if(!data.success){
        this.flashMessage.show(data.message, {
          cssClass: 'alert-danger', timeout: 4000
        });
        this.processing = false;
      } else {
        this.flashMessage.show(data.message, {
          cssClass: 'alert-success', timeout: 4000
        });  
        this.router.navigate(['blogs']);
      } 
    });
  }

  goBack(){
    this.location.back();
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data=>{
      if(!data.success){
        this.flashMessage.show( data.message, {
          cssClass: 'alert-warning', timeout: 4000
        });
        this.router.navigate(['/blogs']);
      } else {
        this.blog = data.blog;
        this.loading = false;
      }
    });
  }

}
