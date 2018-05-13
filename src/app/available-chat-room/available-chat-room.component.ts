import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpServiceService } from '../http-service.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ChatServiceService } from '../chat-service.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';


@Component({
  selector: 'app-available-chat-room',
  templateUrl: './available-chat-room.component.html',
  styleUrls: ['./available-chat-room.component.css'],
  
})
export class AvailableChatRoomComponent implements OnInit {

  public chatRoomName: string;
  public authToken: string;
  public chatRoomArray;
  public userName: string;
  public userId: string;

  constructor(private _route: ActivatedRoute, private router: Router
    , public httpService: HttpServiceService,public chatService: ChatServiceService, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.authToken = Cookie.get('authToken');
    this.checkStatus();
    let userInfo = this.httpService.getUserInfoFromLocalstorage();
    this.userName = userInfo.firstName + " " + userInfo.lastName;
    this.userId = userInfo.userId;
    this.loadChatRooms();
   
  }

  public checkStatus: any = () => {

    if (this.authToken === undefined || this.authToken === '' || this.authToken === null) {

      this.router.navigate(['/']);

      return false;

    } else {

      return true;

    }

  }
  trim(x): any {
    let value = String(x)
    return value.replace(/^\s+|\s+$/gm, '')
  }

  isEmpty(value): any {
    if (value === null || value === undefined || this.trim(value) === '' || value.length === 0) {
      return true
    } else {
      return false
    }
  }

  loadChatRooms(): any {

    let userData = {
      authToken: this.authToken
    }

    this.chatService.getChatRoom(userData).subscribe(

      data => {
        let error = data.error;
        let message = data.message;
        if (error) {
          this.toastr.error(message, 'Fail!!');
          console.log(data);
          this.chatRoomArray = [];
        } else {
          this.toastr.success(message, 'Success!');
          this.chatRoomArray = data.data;
        }

      },
      error => {
        this.toastr.error(error.error.message, 'Oops!');
      }
    );

    return userData;

  }

  onChatRoomCreateButtonClick(): any {


    let userData = {
      chatRoomName: this.chatRoomName,
      authToken: this.authToken,
      creatorName: this.userName,
      creatorId: this.userId
    }

    console.log(userData);

    this.chatService.createChatRoom(userData).subscribe(

      data => {
        let error = data.error;
        let message = data.message;
        if (error) {
          this.toastr.error(message, 'Fail!!');
          console.log(data);
        } else {
          this.toastr.success(message, 'Success!');
          console.log(data);
          this.loadChatRooms();
        }

      },
      error => {
        this.toastr.error(error.error.message, 'Oops!');
      }
    );

    return userData;
  }

  deleteChatRoom(chatRoomId): any {


    let userData = {
      authToken: this.authToken,
      chatRoomId: chatRoomId
    }


    this.chatService.deleteChatRoom(userData).subscribe(

      data => {
        let error = data.error;
        let message = data.message;
        if (error) {
          this.toastr.error(message, 'Fail!!');
          console.log(data);
        } else {
          this.toastr.success(message, 'Success!');
          console.log(data);
          this.loadChatRooms();
        }

      },
      error => {
        this.toastr.error(error.error.message, 'Oops!');
      }
    );

    return userData;

  }

  redirectToChatRoom(chatRoomId): any {
    setTimeout(() => {
      this.router.navigate(['/chatroom', chatRoomId]);
    }, 1000);
  }

}
