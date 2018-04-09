import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../../services/blog.service';
import { ActivatedRoute, Params } from "@angular/router";
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-delete-blog',
  templateUrl: './delete-blog.component.html',
  styleUrls: ['./delete-blog.component.css']
})
export class DeleteBlogComponent implements OnInit {

  processing: boolean = false;
  foundBlog: boolean = false;
  blog: any;
  currentUrl: Params; 

  constructor(
    private blogService: BlogService,
    private flashMessage: FlashMessagesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  deleteBlog(){
    this.processing = true; // Disable buttons
    // Function for DELETE request
    this.blogService.deleteBlog(this.currentUrl.id).subscribe(data => {
      // Check if delete request worked
      if (!data.success) {
        this.flashMessage.show( data.message, {
          cssClass: 'alert-danger', timeout: 4000
        });
      } else {
        this.flashMessage.show( data.message, {
          cssClass: 'alert-success', timeout: 4000
        });
        this.router.navigate(['/blogs']); // Route users to blog page
      }
    });
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data=>{
      if(!data.success){
        this.flashMessage.show( data.message, {
          cssClass: 'alert-warning', timeout: 4000
        });
      } else {
        this.blog = {
          title: data.blog.title,
          body: data.blog.body,
          createdBy: data.blog.createdBy,
          createdAt: data.blog.createdAt
        };
        this.foundBlog = true;
      }
    })
  }

}
