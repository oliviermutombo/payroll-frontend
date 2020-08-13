import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

  constructor(
    public snackBar: MatSnackBar,
    private zone: NgZone) { }

    private timeoutMillis = 3000;

    // SUCESS
    showSuccess(message: string): void {
        // Had an issue with the snackbar being ran outside of angular's zone.
        this.zone.run(() => {
        this.snackBar.open(message, 'X', {panelClass: ['success'], duration: this.timeoutMillis, verticalPosition: 'bottom', horizontalPosition: 'center'});
        });
    }
    showSaved(): void {
        // Had an issue with the snackbar being ran outside of angular's zone.
        this.zone.run(() => {
        this.snackBar.open('Saved successfully', 'X', {panelClass: ['success'], duration: this.timeoutMillis, verticalPosition: 'bottom', horizontalPosition: 'center'});
        });
    }
    showDeleted(): void {
        // Had an issue with the snackbar being ran outside of angular's zone.
        this.zone.run(() => {
        this.snackBar.open('Deleted successfully', 'X', {panelClass: ['success'], duration: this.timeoutMillis, verticalPosition: 'bottom', horizontalPosition: 'center'});
        });
    }

    // FAILURE
    showError(message: string): void {
        this.zone.run(() => {
        // The second parameter is the text in the button. 
        // In the third, we send in the css class for the snack bar.
        this.snackBar.open(message, 'X', {panelClass: ['error'], duration: this.timeoutMillis, verticalPosition: 'bottom', horizontalPosition: 'center'});
        });
    }
    showGenericError(): void {
        this.zone.run(() => {
        // The second parameter is the text in the button. 
        // In the third, we send in the css class for the snack bar.
        this.snackBar.open('Error! something went wrong.', 'X', {panelClass: ['error'], duration: this.timeoutMillis, verticalPosition: 'bottom', horizontalPosition: 'center'});
        });
    }
}