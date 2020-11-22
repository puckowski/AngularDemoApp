// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  appVersionString: 'Version 1.2.0',

  apiUrl: 'http://localhost:5500',

  apiMainGridData: 'assets/mock/json/home-main-grid-data.json',
  apiUserList: 'http://localhost:5500/users',
  apiMockNotes: 'https://ft4ix4gfs6.execute-api.us-east-2.amazonaws.com/prod/notes',
  apiPostNote: 'https://ft4ix4gfs6.execute-api.us-east-2.amazonaws.com/prod/notes',
  apiLambdaLogin: 'https://ft4ix4gfs6.execute-api.us-east-2.amazonaws.com/prod/login'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
