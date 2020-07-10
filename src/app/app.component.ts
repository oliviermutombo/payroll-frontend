import { Component, OnInit } from '@angular/core';
import { DataService } from './admin/data.service';
import { UserService } from './services/user.service';

import { Router } from '@angular/router';
import { UtilitiesService } from './services/utilities.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'payroll-system';

  error = '';
  success = '';

  constructor(private userService: UserService,
              private utilitiesService: UtilitiesService,
              private router: Router) {
    
              //this.userService.hasRole('');
  }

  ngOnInit() {
    //this.utilitiesService.setCurrency();
    this.utilitiesService.setCurrencySymbol();
  }

  hasRole(_role) {
    return this.userService.hasRole(_role);//Checks roles of current user
  }
  
  logout() {
    this.userService.logout();
  }

}
