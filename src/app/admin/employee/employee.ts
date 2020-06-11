export class Employee {
  id: any;
  empCode: any;
  firstName: any;
  middleName: any;//NEWLY ADDED, ADD LOGIC
  lastName: any;
  dob: any;
  passportNumber: any;
  idNumber: any;
  payGrade: any;
  basicPay: any;
  department: any;
  position: any;
  emailAddress: any;
  taxNumber: any;
  hireDate: any;
  address1: any;
  address2: any;
  postalCode: any;
  country: any;
  phoneNumber: any;
  bankName: any;
  bankAccount: any;
  bankBranch: any;
    constructor(
        empCode: string,
        firstName: string,
        middleName: string,
        lastName: string,
        userid: string,
        dob: string,
        idNumber: string,
        passportNumber: string,
        payGrade: number,
        basicPay: number,
        department: number,
        position: number,
        emailAddress: string,
        taxNumber: string,
        hireDate: string,
        address1: string,
        address2: string,
        postalCode: string,
        country: string,
        phoneNumber: string,
        bankName: string,
        bankAccount: string,
        bankBranch: string,
        id?: number) {}
  }
