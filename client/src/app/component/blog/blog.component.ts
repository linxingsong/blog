import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  newPost: boolean = false;
  loadingBlogs: boolean = false;

  constructor() { }

  newBlogForm(){
    this.newPost = true;
  }

  reloadBlog(){
    this.loadingBlogs = true;
    setTimeout(()=>{
      this.loadingBlogs = false;
    }, 4000);
  }

  ngOnInit() {
  }

}
