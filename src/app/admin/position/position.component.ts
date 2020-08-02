import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Position } from './position';
import { ApiService } from 'src/app/admin/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table'; //pagination
import { NotificationService } from '../../services/notification.service';
import { CustomValidators } from '../../services/custom_validators';
import { FormService } from '../../services/form';
import * as globals from 'src/app/globals';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css']
})

export class PositionComponent implements OnInit {

  //
  allPostion:Position[];
  positions: MatTableDataSource<Position>;
  displayedColumns: string[] = ['name','manageColumn'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //

  title = 'payroll-system Positions';

  position = new Position('', 0);

  rForm: FormGroup;
  showList = false;
  updateMode = false;
  post: any;
  name = '';

  public formErrors = {
    name: ''
  };

  constructor(private injector: Injector,
    private apiService: ApiService,
    private fb: FormBuilder,
    public formService: FormService,
    private confirmationDialogService: ConfirmationDialogService) {

    this.rForm = fb.group({
      name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50), CustomValidators.validateCharacters]],
    });

    this.rForm.valueChanges.subscribe((data) => {
      this.formErrors = this.formService.validateForm(this.rForm, this.formErrors, true);
    });
  }
  
  notifier = this.injector.get(NotificationService);

  ngOnInit() {
    if (this.showList) {
      this.getPositions();
    }
  }

  showHideList($isChecked): void {
    if ($isChecked) {
      if (!this.positions) {
        // Above Condition added to make the list available on demand. can't retrieve list if not defined (or it throws an error)
        this.getPositions();
      }
      this.showList = true;
    } else {
      this.showList = false;
    }
  }

  applyFilter(filterValue: string) {
    this.positions.filter = filterValue.trim().toLowerCase();

    if (this.positions.paginator) {
      this.positions.paginator.firstPage();
    }
  }

  getPositions(): void {
    this.apiService.getAll(globals.POSITION_ENDPOINT).subscribe(
      (res: Position[]) => {
        this.positions = new MatTableDataSource(res);
        this.positions.paginator = this.paginator;
        this.positions.sort = this.sort;
      }
    );
  }

  getPosition(id): void {
    this.apiService.getById(globals.POSITION_ENDPOINT, id).subscribe(
      (res: Position) => {
        this.position = res;
      }
    );
  }

  addPosition(f) {
    let position = new Position();
    position.name = f.name;

    this.apiService.save(globals.POSITION_ENDPOINT, position, (this.positions) ? this.positions.data : null)
      .subscribe(
        (res: Position[]) => {
          // Update the list of positions
          if (this.showList) {
            // Above Condition added to make the list available on demand. service will only populate list if requested.
            this.positions.data = res; // Implement a list refresh rather
          }
          // Inform the user
          this.notifier.showSaved();
          // Reset the form
          this.rForm.reset();
        }
      );
  }

  positionEdit(id) {
    this.apiService.getById(globals.POSITION_ENDPOINT, id).subscribe(
      (res: Position) => {
        this.position = res;
        this.rForm.setValue({
          name: this.position.name,
        });
      }
    );
    this.updateMode = true;
    window.scroll(0, 0);
  }

  updatePosition(f) {
    this.position.name = f.name;
    this.apiService.update(globals.POSITION_ENDPOINT, this.position, this.positions.data)
      .subscribe(
        (res) => {
          if (this.showList) {
            this.positions.data = res; // Implement a list refresh rather
          }
          this.position = new Position();
          this.notifier.showSaved();
          this.updateMode = false;
          this.rForm.reset();
        }
      );
  }

  public openConfirmationDialog(id) {
    this.confirmationDialogService.confirm('Please confirm...', 'Are you sure you want to delete?')
    .then((confirmed) => {
      if (confirmed) this.deletePosition(id);
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  deletePosition(id) {
    this.apiService.delete(globals.POSITION_ENDPOINT, id, this.positions.data)
      .subscribe(
        (res: Position[]) => {
          if (this.showList) {
            this.positions.data = res; // Impelement a list refresh rather
          }
          this.notifier.showDeleted();
          this.updateMode = false;
          this.rForm.reset();
        }
      );
  }
}
