import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { HttpServiceService } from '../http-service.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: string;
  public password: string;

  constructor(private _route: ActivatedRoute, private router: Router
    , public httpService: HttpServiceService, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
  }

  public login(): any {

    let userData = {
      email: this.email,
      password: this.password,
    }

    console.log(userData);

    this.httpService.loginUser(userData).subscribe(

      data => {
        let error = data.error;
        let message = data.message;
        let authToken = data.data.authToken;
        if (error) {
          this.toastr.error(message, 'Fail!!');
          console.log(data);
        } else {
          if (data.status === 200) {
            Cookie.set('authToken', authToken);
            this.httpService.setUserInfoInLocalStorage(data.data.userDetails);
            this.toastr.success(message, 'Success!');
            console.log(data.data);
            setTimeout(() => {
              this.router.navigate(['/availablechatroom']);
            },
              2000);
          }

        }

      },
      error => {

        this.toastr.error(error.error.message, 'Oops!');
      }
    );

    return userData;
  }

  public redirectToForgotPasswordPage(): any {

    this.router.navigate(['/forgotpassword']);

  }

  public redirectToSignUpPage(): any {

    this.router.navigate(['/signup']);

  }
}
