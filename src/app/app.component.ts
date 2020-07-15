import { Component, OnInit } from '@angular/core';
import { DataService } from './admin/data.service';
import { UserService } from './services/user.service';

import { Router } from '@angular/router';
import { UtilitiesService } from './services/utilities.service';
import { AuthService } from './services/auth.service';

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
              public auth: AuthService,
              private utilitiesService: UtilitiesService,
              private router: Router) {
    
              //this.userService.hasRole('');
  }

  ngOnInit() {
    if (this.auth.getJwtToken()) this.utilitiesService.setCurrencySymbol();
  }

  hasRole(_role) {
    //return this.userService.hasRole(_role);//Checks roles of current user
    return this.auth.hasRole(_role);
  }
  
  logout() {
    //this.userService.logout();
    this.auth.logout();
  }

}
