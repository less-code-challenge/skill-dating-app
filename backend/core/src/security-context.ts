import {Request} from 'express-serve-static-core';

export interface SecurityContext {
  currentUsername?: string;
}

interface RequestWithLambdaContext extends Request {
  requestContext: { authorizer?: { jwt?: { claims?: { email?: string } } } };
}

export function getSecurityContextFrom(request: Request): SecurityContext {
  const requestWithItsLambdaContext = request as RequestWithLambdaContext;
  const email = requestWithItsLambdaContext?.requestContext?.authorizer?.jwt?.claims?.email || '';
  const currentUsername = extractUsernameFrom(email);

  function extractUsernameFrom(email: string) {
    if (email) {
      const userAndDomain = email.split('@');
      if (userAndDomain && userAndDomain.length) {
        return userAndDomain[0];
      }
    }
    return '';
  }

  return {currentUsername};
}
