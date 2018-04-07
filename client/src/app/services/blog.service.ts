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
    this.authService.loadToekn();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authService.authToken
      })
    });
  }

  newBlog(blog){
    this.createAuthenticationHeader();
    return this.http.post(this.domain+ 'blog/newBlog', blog, this.options).map(res=>res.json());
  }
}
