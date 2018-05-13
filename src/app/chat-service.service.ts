import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams,HttpHeaders  } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable()
export class ChatServiceService {
  public baseUrl = `http://localhost:3000/api/v1/chatRoom`;
  
  constructor(private _http: HttpClient) {
    console.log("chat room  service was called");
  }

  public createChatRoom (userData) : any  {
    let myResponse = this._http.post(this.baseUrl + '/create' ,userData);
    return myResponse;
  }

  public deleteChatRoom (userData) : any  {
    let myResponse = this._http.post(this.baseUrl + '/delete' ,userData);
    return myResponse;
  }

  
  public getChatRoom (userData) : any{

    let authToken = userData.authToken;
    const params = new HttpParams().set('authToken',authToken);

    let myResponse = this._http.get(`${this.baseUrl}/getall?${params}`);
    return myResponse;

  }

}
