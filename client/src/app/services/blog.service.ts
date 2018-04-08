import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class BlogService {
  domain: string = this.authService.domain;
  options: RequestOptions; 

  constructor(
    private authService: AuthService,
    private http: Http
  ) { }

  createAuthenticationHeader(){
    this.authService.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authService.authToken
      })
    });
  }

  newBlog(blog){
    this.createAuthenticationHeader();
    return this.http.post(this.domain + 'blogs/newBlog', blog, this.options).map(res=>res.json());
  }

  getAllBlogs(){
    this.createAuthenticationHeader();
    return this.http.get(this.domain + 'blogs/allBlogs', this.options).map(res=>res.json());
  }

  getSingleBlog(id){
    this.createAuthenticationHeader();
    return this.http.get(this.domain + 'blogs/singleBlog/'+id, this.options).map(res=>res.json());
  }

  editBlog(blog){
    this.createAuthenticationHeader();
    return this.http.put(this.domain +'blogs/updateBlog/', blog, this.options).map(res=>res.json());
  }

}
