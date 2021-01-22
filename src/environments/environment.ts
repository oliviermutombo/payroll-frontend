// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

//apiUrl: 'http://localhost:8000/api' v0

export const environment = {
  production: false,
  apiUrl: 'https://payrollapplication.herokuapp.com',
  apiVersion: '/api/v1',
  baseUrl: 'https://payrollapplication.herokuapp.com/api/v1',
  apiUsername: 'payroll-client',
  apiPassword: 'payroll-secret'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
