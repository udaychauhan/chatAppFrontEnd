import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable()
export class HttpServiceService {

  public baseUrl = `http://localhost:3000/api/v1/users`;

  constructor(private _http: HttpClient) {
    console.log("http service was called");
  }

  public createUser(userData): any {
    let myResponse = this._http.post(this.baseUrl + '/signup', userData);
    return myResponse;
  }

  public loginUser(userData): any {
    let myResponse = this._http.post(this.baseUrl + '/login', userData);
    return myResponse;
  }

  public sendEmailForPasswordChange(userData): any {
    let myResponse = this._http.post(this.baseUrl + '/forgotpassword', userData);
    return myResponse;
  }

  public changePassword(authToken, userData): any {
    let myResponse = this._http.post(this.baseUrl + '/changePassword', userData);
    return myResponse;
  }

  public getUserInfoFromLocalstorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  } // end getUserInfoFromLocalstorage


  public setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data))
  }

}
