import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class FormService {

  // get all values of the formGroup, loop over them
  // then mark each field as touched
  // Not used currently
  private markFormGroupTouched(formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach(control => {
      alert ('control.markAsTouched()');
      control.markAsTouched();

      if (control.controls) {
        alert ('if - this.markFormGroupTouched(control)');
        this.markFormGroupTouched(control);
      }
    });
  }
  /*ORIGINAL
  public markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
          control.controls.forEach(c => this.markFormGroupTouched(c));
      }
    });
  }*/

  // return list of error messages
  public validationMessages() {
    const messages = {
      required: 'This field is required',
      email: 'This email address is invalid',
      invalid_currency_amount: 'Numbers only. Format # or #.#',
      incorrect_dob: 'Date of birth cannot be in the future',
      incorrect_payroll_period: 'Must be first day of the month',
      invalid_characters: (matches: any[]) => {
        let matchedCharacters = matches;

        matchedCharacters = matchedCharacters.reduce((characterString, character, index) => {
          let string = characterString;
          string += character;

          if (matchedCharacters.length !== index + 1) {
            string += ', ';
          }

          return string;
        }, '');

        return `These characters are not allowed: ${matchedCharacters}`;
      },
    };

    return messages;
  }

  // Validate form instance
  // check_dirty true will only emit errors if the field is touched
  // check_dirty false will check all fields independent of
  // being touched or not. Use this as the last check before submitting
  public validateForm(formToValidate: FormGroup, formErrors: any, checkDirty?: boolean) {
    const form = formToValidate;

    for (const field in formErrors) {
      if (field) {
        formErrors[field] = '';
        const control = form.get(field);

        const messages = this.validationMessages();
        if (control && !control.valid) {
          if (!checkDirty || (control.dirty || control.touched)) {
            for (const key in control.errors) {
                if (key && key === 'invalid_characters') {
                    formErrors[field] = formErrors[field] || messages[key](control.errors[key]);
                } else if (key && key === 'minlength') {
                    formErrors[field] = formErrors[field] ||
                    this.checkMinLength(control.errors[key].requiredLength, control.errors[key].actualLength);
                } else if (key && key === 'maxlength') {
                    formErrors[field] = formErrors[field] ||
                    this.checkMaxLength(control.errors[key].requiredLength, control.errors[key].actualLength);
                } else {
                    formErrors[field] = formErrors[field] || messages[key];
                }
            }
          }
        }
      }
    }

    return formErrors;
  }

  checkMinLength(requiredLength, actualLength): any {
    if (actualLength < requiredLength) {
        return 'Minimum length is ' + requiredLength;
    } else { return null; }
  }

  checkMaxLength(requiredLength, actualLength): any {
    if (actualLength > requiredLength) {
        return 'Maximum length is ' + requiredLength;
    } else { return null; }
  }
}
