import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  //constructor(private userService: UserService) { }
  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  hasRole(_role) {
    //return this.userService.hasRole(_role);//Checks roles of current user
    return this.auth.hasRole(_role);//Checks roles of current user
  }

}
