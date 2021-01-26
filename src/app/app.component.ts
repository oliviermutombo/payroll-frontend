import { Component, OnInit } from '@angular/core';

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

  constructor(public auth: AuthService,
              private utilitiesService: UtilitiesService,
              private router: Router) {
  }

  ngOnInit() {
    if (this.auth.getJwtToken()) this.utilitiesService.setCurrencySymbol();
  }


  hasRole(_role) {
    return this.auth.hasRole(_role);
  }
  
  logout() {
    this.auth.logout();
  }

}
