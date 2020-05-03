import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
    alert('DashboardComponent - ngOnInit() \n' + this.userService.test());
  }

  hasRole(_role) {
    return this.userService.hasRole(_role);//Checks roles of current user
  }

}
