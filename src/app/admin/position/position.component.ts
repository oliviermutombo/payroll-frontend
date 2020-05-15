import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Position } from './position';
import { PositionService } from './position.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material'; //pagination
import { NotificationService } from '../../services/notification.service';
import { CustomValidators } from '../../services/custom_validators';
import { FormService } from '../../services/form';

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

  title = 'payroll-system';
  //positions: Position[];
  error = '';
  success = '';

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
    private positionService: PositionService,
    private fb: FormBuilder,
    public formService: FormService) {

    this.rForm = fb.group({
      name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50), CustomValidators.validateCharacters]],
    });

    this.rForm.valueChanges.subscribe((data) => {
      this.formErrors = this.formService.validateForm(this.rForm, this.formErrors, true);
    });
  }
  
  notifier = this.injector.get(NotificationService);

  ngOnInit() {
    //this.positions.paginator = this.paginator;
    //this.positions.sort = this.sort;

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

  getPositions(): void { // UPDATE TO POINT TO DATA SERVICE INSTEAD
    this.positionService.getAllPositions().subscribe(
      (res: Position[]) => {
        //this.positions = res;
        this.positions = new MatTableDataSource(res);
        this.positions.paginator = this.paginator;
        this.positions.sort = this.sort;
      }
    );
  }

  getPosition(id): void { // UPDATE TO POINT TO DATA SERVICE INSTEAD
    this.positionService.getPosition(id).subscribe(
      (res: Position) => {
        this.position = res;
      }
    );
  }

  addPosition(f) {
    this.resetErrors();

    this.position.name = f.name;

    this.positionService.storePosition(this.position)
      .subscribe(
        (res: Position[]) => {
          // Update the list of positions
          if (this.showList) {
            // Above Condition added to make the list available on demand. service will only populate list if requested.
            this.positions = new MatTableDataSource(res); // Impelement a list refresh rather
          }
          // Inform the user
          this.success = 'Created successfully';
          this.notifier.showSaved();
          // Reset the form
          this.rForm.reset();
        }
      );
  }

  positionEdit(id) {
    this.positionService.getPosition(id).subscribe(
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
    this.resetErrors();
    this.position.name = f.name;
    this.positionService.updatePosition(this.position)
      .subscribe(
        (res) => {
          if (this.showList) {
            this.positions = new MatTableDataSource(res); // Impelement a list refresh rather
          }
          this.success = 'Updated successfully';
          this.notifier.showSaved();
          this.updateMode = false;
          this.rForm.reset();
        }
      );
  }

  deletePosition(id) {
    this.resetErrors();
    this.positionService.deletePosition(id)
      .subscribe(
        (res: Position[]) => {
          if (this.showList) {
            this.positions = new MatTableDataSource(res); // Impelement a list refresh rather
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
