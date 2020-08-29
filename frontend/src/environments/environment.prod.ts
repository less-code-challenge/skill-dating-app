export const environment = {
  production: true,
  backendUri: 'https://v7092hxk09.execute-api.eu-central-1.amazonaws.com/',
  authConfig: {
    userPoolId: 'eu-central-1_Fst1zV7Ho',
    userPoolWebClientId: '66ihqtvesmfk01jrl0ht4o48ob',
    oauth: {
      region: 'eu-central-1',
      domain: 'skill-dating-app-users.auth.eu-central-1.amazoncognito.com',
      scope: ['email', 'openid', 'aws.cognito.signin.user.admin'],
      redirectSignIn: 'https://d3abbr6cpithns.cloudfront.net/after-sign-in-callback',
      redirectSignOut: 'https://d3abbr6cpithns.cloudfront.net/',
      responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
    }
  }
};
