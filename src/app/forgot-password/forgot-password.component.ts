import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { HttpServiceService } from '../http-service.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public email: string;
  

  constructor(private _route: ActivatedRoute, private router: Router
    , public httpService: HttpServiceService, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
  }

  public sendEmailIdForPassword(): any {

    let userData = {
      email: this.email,
    
    }

    console.log(userData);

    this.httpService.sendEmailForPasswordChange(userData).subscribe(

      data => {
        let error = data.error;
        let message = data.message;
        if(error){
          this.toastr.error(message, 'Fail!!');
          console.log(data);
        }else{
          this.toastr.success("Redirecting to Change Password Page", 'Success!');
          console.log(data);
          let token = message;
          setTimeout(()=>{
            this.router.navigate(['/changepassword',token]);
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
