import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { HttpServiceService } from '../http-service.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  public  password: string;
  private token : string;
  

  constructor(private _route: ActivatedRoute, private router: Router
    , public httpService: HttpServiceService, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.token = this._route.snapshot.paramMap.get('token');
    
  }

  public changePassword(): any {

    let userData = {
      password: this.password,
      authToken : this.token
    }

    console.log(userData);

    this.httpService.changePassword(this.token,userData).subscribe(

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
