import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Costcentre } from './costcentre';
import { CostcentreService } from './costcentre.service';

import { CustomValidators } from '../../services/custom_validators';
import { FormService } from '../../services/form';

import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-costcentre',
  templateUrl: './costcentre.component.html',
  styleUrls: ['./costcentre.component.css']
})

export class CostcentreComponent implements OnInit {
  title = 'payroll-system';
  costcentres: Costcentre[];
  error = '';
  success = '';

  parentMessage = 'message from parent';

  costcentre = new Costcentre('', '');

  rForm: FormGroup;
  showList = false;
  updateMode = false;
  post: any;
  name = '';
  owner = '';

  public formErrors = {
    name: '',
    owner: '',
  };

  constructor(private injector: Injector, private costcentreService: CostcentreService, private fb: FormBuilder, public formService: FormService) {
    this.rForm = fb.group({
      name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50), CustomValidators.validateCharacters]],
      owner: [null]
    });

    this.rForm.valueChanges.subscribe((data) => {
      this.formErrors = this.formService.validateForm(this.rForm, this.formErrors, true);
    });
  }

  notifier = this.injector.get(NotificationService);

  ngOnInit() {
    if (this.showList) {
      this.getCostcentres();
    }
  }

  showHideList($isChecked): void {
    if ($isChecked) {
      if (!this.costcentres) {
        // Above Condition added to make the list available on demand. can't retrieve list if not defined (or it throws an error)
        this.getCostcentres();
      }
      this.showList = true;
    } else {
      this.showList = false;
    }
  }
  getCostcentres(): void { // UPDATE TO POINT TO DATA SERVICE INSTEAD
    this.costcentreService.getAllCostcentres().subscribe(
      (res: Costcentre[]) => {
        this.costcentres = res;
      }
    );
  }

  getCostcentre(id): void { // UPDATE TO POINT TO DATA SERVICE INSTEAD
    this.costcentreService.getCostcentre(id).subscribe(
      (res: Costcentre) => {
        this.costcentre = res;
      }
    );
  }

  addCostcentre(f) {
    this.resetErrors();

    this.costcentre.name = f.name;
    this.costcentre.owner = f.owner;

    this.costcentreService.storeCostcentre(this.costcentre)
      .subscribe(
        (res: Costcentre[]) => {
          // Update the list of costcentres
          if (this.showList) {
            // Above Condition added to make the list available on demand. service will only populate list if requested.
            this.costcentres = res;
          }
          // Inform the user
          this.success = 'Created successfully';
          this.notifier.showSaved();

          // Reset the form
          this.rForm.reset();
        }
      );
  }

  costcentreEdit(id) {
    this.costcentreService.getCostcentre(id).subscribe(
      (res: Costcentre) => {
        this.costcentre = res;
        this.rForm.setValue({
          name: this.costcentre.name,
          owner: this.costcentre.owner,
        });
      }
    );
    this.updateMode = true;
    window.scroll(0, 0);
  }

  updateCostcentre(f) {
    this.resetErrors();
    this.costcentre.name = f.name;
    this.costcentre.owner = f.owner;
    this.costcentreService.updateCostcentre(this.costcentre)
      .subscribe(
        (res) => {
          if (this.showList) {
            this.costcentres = res;
          }
          this.success = 'Updated successfully';
          this.notifier.showSaved();
          this.updateMode = false;
          this.rForm.reset();
        }
      );
  }

  deleteCostcentre(id) {
    this.resetErrors();
    this.costcentreService.deleteCostcentre(id)
      .subscribe(
        (res: Costcentre[]) => {
          if (this.showList) {
            this.costcentres = res;
          }
          this.success = 'Deleted successfully';
          this.notifier.showDeleted();
          this.updateMode = false;
          this.rForm.reset();
        }
      );
  }

  private resetErrors() {
    this.success = '';
    this.error   = '';
  }
}
