import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";

@Injectable()
export class SocketService {

  private url = 'http://localhost:3000';
  private socket;

  constructor(public http: HttpClient) {
    console.log("socket service called");
    this.socket = io(this.url);
  }

  //-- start of listen events
  public verifyUser = () => {
    let obs = Observable.create((observer) => {
      this.socket.on('verifyUser', (data) => {
        console.log(data);
        observer.next(data);
      });
    });
    return obs;
  }

  public onlineUserListListener = () => {
    let obs = Observable.create((observer) => {
      this.socket.on('onlineUserList', (data) => {
        console.log(data);
        observer.next(data);
      });
    });
    return obs;
  }

  public chatMessageListener = () => {
    let obs = Observable.create((observer) => {
      this.socket.on('chatMsg', (data) => {
        console.log(data);
        observer.next(data);
      });
    });
    return obs;
  }

   // main issue on server side are that the roon id is undefined and the 
  // db is aync but we are sending data when result is positive, that is  when we find
  // chats from db look at server side code, but why is socket.room undefined
  public getRoomMessages = () => {
    let obs = Observable.create((observer) => {
      this.socket.on('myMsg', (data) => {
         observer.next(data);
      });
    });
    return obs;
  }

  public listenUserTyping = () => {
    let obs = Observable.create((observer) => {
      this.socket.on('userTyping', (data) => {
         observer.next(data);
      });
    });
    return obs;
  }


  public errorListener = () => {
    let obs = Observable.create((observer) => {
      this.socket.on('errorEvent', (data) => {
        console.log(data);
        observer.next(data);
      });
    });
    return obs;
  }
  

  public disconnectedSocketListener = () => {
    return Observable.create((observer) => {
      this.socket.on("disconnect", () => {
        observer.next();
      }); // end Socket
    }); // end Observable
  }
  //--- end of listen events

  //-- start of emit events
  public setUser = (authToken) => {
    // this will set socket id after verifying from token
    this.socket.emit('setUser',authToken);
  }

  public sendChatMessage = (data) => {
    this.socket.emit('chatMsg',data);
  }

  public callForChatRoomMessages = () => {
    this.socket.emit('allChatRoomMsg',"");
  }

   public sendTypingMessage = (data) =>{
     this.socket.emit('userTyping' , data);
   }

   public disconnectSocket = () => {
     this.socket.disconnect();
   }
}
