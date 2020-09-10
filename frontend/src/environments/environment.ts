// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  backendUri: 'https://ad65c4iw0c.execute-api.eu-central-1.amazonaws.com',
  authConfig: {
    userPoolId: 'eu-central-1_Fst1zV7Ho',
    userPoolWebClientId: '66ihqtvesmfk01jrl0ht4o48ob',
    oauth: {
      region: 'eu-central-1',
      domain: 'skill-dating-app-users.auth.eu-central-1.amazoncognito.com',
      scope: ['email', 'openid', 'aws.cognito.signin.user.admin'],
      redirectSignIn: 'http://localhost:4200/after-sign-in-callback',
      redirectSignOut: 'http://localhost:4200/',
      responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
