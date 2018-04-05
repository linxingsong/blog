import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';



@Injectable()
export class AuthService {

  domain: string = 'http://localhost:8080'
  authToken: string;
  user: any;
  options: RequestOptions; 

  constructor(
    private http: Http
  ) { }

  createAuthenticationHeader(){
    this.loadToekn();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authToken
      })
    });
  }

  loadToekn(){
    this.authToken = localStorage.getItem('token');
  }

  registerUser(user){
    return this.http.post(this.domain + '/authentication/register', user).map(res=> res.json());
  }

  checkUsername(username) {
    return this.http.get(this.domain + '/authentication/checkUsername/' + username).map(res => res.json());
  }

  checkEmail(email){
    return this.http.get(this.domain + '/authentication/checkEmail/'+ email).map(res=> res.json());
  }

  login(user){
    return this.http.post(this.domain+ '/authentication/login', user).map(res=> res.json());
  }

  storeUserData(token, user){
    localStorage.setItem('token', token),
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  getProfile(){
    this.createAuthenticationHeader();
    return this.http.get(this.domain + '/authentication/profile', this.options).map(res=> res.json());
  }

}
