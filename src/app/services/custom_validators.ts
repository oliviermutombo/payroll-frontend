import { FormControl, Validators } from '@angular/forms';

// setup simple regex for white listed characters
const validCharacters = /[^\s\w,.:&\/()+%'`@-]/;
const numberOrDecimal = '^[0-9]+(?:\.[0-9]+)?$';
const numbersOnlyRule = /[^\s\w,.:&\/()+%'`@-]/;

// create your class that extends the angular validator class
export class CustomValidators extends Validators {

  // create a static method for your validation
  static validateCharacters(control: FormControl) {

    // first check if the control has a value
    if (control.value && control.value.length > 0) {

      // match the control value against the regular expression
      const matches = control.value.match(validCharacters);

      // if there are matches return an object, else return null.
      return matches && matches.length ? { invalid_characters: matches } : null;
    } else {
      return null;
    }
  }

  static numberOrDecimal(control: FormControl) {

    if (control.value && control.value.length > 0) {

        if (!control.value.match(numberOrDecimal)) {
            return { invalid_currency_amount: true };
        } else {
            return null;
        }
    } else {
        return null;
    }
  }

  static DateOfBirth(control: FormControl) {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    const yyyy = today.getFullYear();

    let day = String(dd);
    let month = String(mm);
    if (dd < 10) {
      day = '0' + dd;
    }
    if (mm < 10) {
      month = '0' + mm;
    }

    let todayStr = yyyy + '-' + month + '-' + day;

    const dob = new Date(control.value);
    const todayDate = new Date(todayStr);

    if (dob > todayDate) {
        return { incorrect_dob : true };
    } else {
        return null;
    }
  }

  static PayrollPeriodDate(control: FormControl) {
    const d = new Date(control.value);
    let dd = d.getDate();
    if (dd>1) {
      return { incorrect_payroll_period : true };
    } else {
      return null;
    }
  }

}
