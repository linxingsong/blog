import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  processing: boolean = false;
  form: FormGroup;

  constructor(
    private formbuilder: FormBuilder,
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router,
  ) { 
    this.createForm();
  }

  createForm(){
    this.form = this.formbuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  disableForm(){
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
  }

  enableForm(){
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
  }

  onLoginSumbit(){
    this.processing = true;
    this.disableForm();

    const user =  {
      username: this.form.get('username').value,
      password: this.form.get('password').value
    };
    
    this.authService.login(user).subscribe(data => {
      if(!data.success){
        this.flashMessage.show(data.message, {
          cssClass: 'alert-danger', timeout: 4000
        });
        this.processing = false;
        this.enableForm();
      } else {
        this.flashMessage.show(data.message, {
          cssClass: 'alert-success', timeout: 4000
        });
        this.authService.storeUserData(data.token, data.user);
        this.router.navigate(['/dashboard']);
      }
    });
  }

  ngOnInit() {
  
  }

}
