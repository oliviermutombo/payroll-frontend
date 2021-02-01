import { Component, OnInit } from "@angular/core";
import { ApiService } from 'src/app/admin/api.service';
import * as globals from 'src/app/globals';

@Component({
    templateUrl: './config.component.html'
  })

  export class ConfigComponent implements OnInit {

    initialLoadEnabled = undefined;
    constructor(private apiService: ApiService) {

    }

    //loadButtonclicked = false;
    
    ngOnInit(): void {
      this.apiService.getAll(globals.DATA_LOADER_ENDPOINT).toPromise().then(response => {
        if (response) {
          if (response['message'] == 'Yes') {
            //alert('statics already loaded, disable loading');
            this.initialLoadEnabled = false; //statics already loaded, disable loading
          } else if (response['message'] == 'No') {
            //alert('statics not loaded, enable loading');
            this.initialLoadEnabled = true; //statics not loaded, enable loading
          }
        }
      });
    }
    
    triggerLoad(element) {
      this.apiService.saveOnly(globals.DATA_LOADER_ENDPOINT, null).subscribe();
      let self=this;
      setTimeout(function(){
        self.apiService.getAll(globals.DATA_LOADER_ENDPOINT).toPromise().then(response => {
          if (response) {
            if (response['message'] == 'Yes') {
              element.textContent = 'Import done!'; 
            } else if (response['message'] == 'No') {
              element.textContent = 'Import failed!!!'; 
            }
          }
        });
      }, 5000);
      element.textContent = 'Importing...';
      element.disabled = true;
    }
  }