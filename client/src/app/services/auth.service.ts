import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {

  domain: string = ''
  authToken: string;
  user: any;
  options: RequestOptions; 

  constructor(
    private http: Http
  ) { }

  createAuthenticationHeader(){
    this.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authToken
      })
    });
  }

  loadToken(){
    this.authToken = localStorage.getItem('token');
  }

  registerUser(user){
    return this.http.post(this.domain + 'authentication/register', user).map(res=> res.json());
  }

  checkUsername(username) {
    return this.http.get(this.domain + 'authentication/checkUsername/' + username).map(res => res.json());
  }

  checkEmail(email){
    return this.http.get(this.domain + 'authentication/checkEmail/'+ email).map(res=> res.json());
  }

  login(user){
    return this.http.post(this.domain+ 'authentication/login', user).map(res=> res.json());
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  storeUserData(token, user){
    localStorage.setItem('token', token),
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  getProfile(){
    this.createAuthenticationHeader();
    return this.http.get(this.domain + 'authentication/profile', this.options).map(res=> res.json());
  }

  loggedIn(){
    return tokenNotExpired();
  }

  getpublicProfile(username){
    this.createAuthenticationHeader();
    return this.http.get(this.domain + 'authentication/publicProfile/'+username, this.options).map(res=> res.json());
  }

  ngOnInit() {
    const token = localStorage.getItem('token'); // Check if a token exists in local storage
    // Check if the token actually exists
    if (token) {
      // Check if the token is not expired
      if (this.loggedIn()) {
        this.loadToken(); // Ensue user is logged in
      } else {
        this.logout(); // Should not have token; log user out
      }
    } else {
      this.logout(); // Log the user out
    }

  }

}
