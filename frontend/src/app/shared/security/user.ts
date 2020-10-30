export interface User {
  firstName: string;
  lastName: string;
  initials: string;
  username: string;
  email: string;
}

export function createUserFrom(email: string | undefined): User | undefined {
  if (email) {
    const [username] = email.split('@');
    const nameParts = username?.split('.');
    const firstName = nameParts?.length > 0 ? capitalize(nameParts[0]) : '';
    const lastName = nameParts?.length > 1 ? capitalize(nameParts[nameParts?.length - 1]) : '';
    const firstNameInitial = firstName?.length > 0 ? firstName[0] : '';
    const lastNameInitial = lastName?.length > 0 ? lastName[0] : '';
    const initials = firstNameInitial + lastNameInitial;

    return {email, username, firstName, lastName, initials};
  }
  return;
}

function capitalize(text: string): string {
  if (text?.length > 0) {
    return text[0].toUpperCase() + text.slice(1);
  }
  return text;
}
