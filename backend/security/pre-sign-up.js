exports.handler = (event, context, callback) => {
  let error = new Error('Please use your corporate email');
  // split the email address so we can compare domains
  const emailParts = event.request.userAttributes.email.split("@")
  if (emailParts && emailParts.length > 1) {
    const domain = emailParts[1];
    if (domain === 'capgemini.com') {
      error = null;
    } else {
      console.log(`Someone tried to sign up using ${event.request.userAttributes.email}`);
    }
  }

  // Return to Amazon Cognito
  callback(error, event);
};
