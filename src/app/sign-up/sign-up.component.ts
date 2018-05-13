import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { HttpServiceService } from '../http-service.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

 public firstName : string;
 public lastName : string;
 public phoneNumber : string;
 public email : string;
 public password : string;

  constructor(private _route: ActivatedRoute, private router: Router
    , public httpService: HttpServiceService,public toastr: ToastsManager, vcr: ViewContainerRef) {
      this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
  }

  public createUser() : any {
    let userData = {
     
      firstName: this.firstName,
      lastName:this.lastName,
      email: this.email,
      mobileNumber: this.phoneNumber,
      password: this.password,
      
    }

    console.log(userData);

    this.httpService.createUser(userData).subscribe(
      data => {
        let error = data.error;
        let message = data.message;
        if(error){
          this.toastr.error(message, 'Fail!!');
          console.log(data);
        }else{
          this.toastr.success(message, 'Success!');
          console.log(data);
          setTimeout(()=>{
            this.router.navigate(['/login']);
          },1000);
        }
       
      },
      error => {
        
        this.toastr.error(error.error.message, 'Oops!');
      }
     
    );

    return userData;

  }
}
