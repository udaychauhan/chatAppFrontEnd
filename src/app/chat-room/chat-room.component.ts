import { Component, OnInit, ViewContainerRef,ElementRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { HttpServiceService } from '../http-service.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ChatServiceService } from '../chat-service.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from '../socket.service';
import {ChatMessage} from './message-interface';




@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
  providers: [SocketService]
})

export class ChatRoomComponent implements OnInit {
  
  public chatRoomId : string;
  public senderName : string;
  public senderId : string;
  public userName : string;
  public userId : string;
  public authToken : string;
  public socketDisconnected : boolean;
  public messageText : string;
  public chatRoomMessages : any = [];
  public isTyping : string;
  
  


  constructor(private _route: ActivatedRoute, private router: Router
    , public httpService: HttpServiceService,public socketService : SocketService, public chatService: ChatServiceService, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
    // well this is done because the socket is not discconnected
    // when we navigate to new page
    // so here we will discconnect it. Hopefully!!
    this.router.events.forEach((event) => {
      if(event instanceof NavigationStart){
        // congrats this works!!
        this.socketService.disconnectSocket();
      }
    });
  }

  ngOnInit() {
    this.socketDisconnected = true;
    this.authToken =  Cookie.get('authToken');
    this.chatRoomId = this._route.snapshot.paramMap.get('chatroomid');
    let userInfo = this.httpService.getUserInfoFromLocalstorage();
    this.senderName = userInfo.firstName + " " + userInfo.lastName;
    this.senderId = userInfo.userId;
    this.checkStatus();
    this.listenForError();
    this.verifyUserConfirmation();
    this.onlineUserList();
    this.listenForMessage();
    this.listenForAllMessaagesOfTheRoom();
    this.listenForUserTyping();
    
 }

  public checkStatus: any = () => {

    if (this.authToken === undefined || this.authToken === '' || this.authToken === null
   ||this.chatRoomId === undefined || this.chatRoomId === '' || this.chatRoomId === null) {

      this.router.navigate(['/']);

      return false;

    } else {

      return true;

    }

   

  } // end checkStatus

  public verifyUserConfirmation : any = () => {
    this.socketService.verifyUser()
      .subscribe((data) => {
        
        this.socketDisconnected = false;
        this.toastr.info(data.message,"Info.");
        let authData = {
          authToken : Cookie.get('authToken'),
          chatRoomId : this.chatRoomId
        }
        this.socketService.setUser(authData);
        // proper calling of this is required
        // or this should be handled by server??
        // find out the solution
        this.socketService.callForChatRoomMessages();
      });
  }//end verify user consfirmation

  public onlineUserList : any = () => {
    this.socketService.onlineUserListListener()
      .subscribe((data) => {
        if(data.message == "join"){
          this.toastr.info(data.sendBy + " joined the room.","Info.");
        }else{
          this.toastr.info(data.sendBy + " left the room.","Info.");
        }
        
        console.log(data + " new user connected/ disconnected");

        let onlineUserArray : any = [];
        onlineUserArray = data.list;
      });
  }//end online user list

  public listenForError : any = () => {
    this.socketService.errorListener()
    .subscribe((data) => {
           
      this.toastr.error(data,"Error");
     

    });
  }

  public listenForMessage : any = () => {
    this.socketService.chatMessageListener().subscribe(
      (data) => {
        console.log("Message is "+data);
        this.toastr.info(data.senderName + " says " + data.message,"Message");
        this.chatRoomMessages.push(data);
        console.log(this.chatRoomMessages);
      }
    );
  }

  public listenForUserTyping : any = () => {
    this.socketService.listenUserTyping().subscribe(
      (data) => {
        this.isTyping = data.senderName + " is typing.";
        setTimeout(()=>{
          this.isTyping = ""
        },1000);
      }
    );
  }
  
  public listenForAllMessaagesOfTheRoom : any = ()=>{

    this.socketService.getRoomMessages().subscribe(
      (data) => {
        console.log("Message is "+data);
        //this.toastr.info(data,"Message");
        this.chatRoomMessages = data;
      }
    );
  }

  public sendTypingEventToOtherUsers: any = (event: any) => {
      this.sendTypingEventMessage();
  } // end sendMessageUsingKeypress

  public sendTypingEventMessage:any = ()=>{

    let typingMessage = {
      senderName : this.senderName
    }

    this.socketService.sendTypingMessage(typingMessage);
  }

  public sendMessageUsingKeypress: any = (event: any) => {

    if (event.keyCode === 13) { // 13 is keycode of enter.

      this.sendMessage();

    }

  } // end sendMessageUsingKeypress

  public sendMessage : any = () => {
    if(this.isEmpty(this.messageText)){
      return;
    }

    let newMessage : ChatMessage = {
      senderName : this.senderName,
      senderId : this.senderId,
      message :this.messageText
    }

    this.socketService.sendChatMessage(newMessage);
    this.chatRoomMessages.push(newMessage);
    this.messageText = "";
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

 

}
