import { OfficeLocationTo } from './office-location.to';

export interface UserProfileTo {
  firstname: string;
  lastname: string;
  username: string;
  description?: string;
  phoneNo?: string;
  officeLocation?: OfficeLocationTo;
  skills?: string[];
}

export interface UserProfileMethods {
  getInitials(): string;

  getFirstName(): string;

  getFullName(): string;

  getOfficeLocation(): string;
}

export function initialUserProfileOf(email: string): UserProfileTo {
  const [username] = email.split('@');
  const [firstname, lastname] = username.split('.');
  return {
    username,
    firstname: capitalize(firstname),
    lastname: capitalize(lastname),
  };
}

export function userProfileOf(userProfile: UserProfileTo): UserProfileMethods {
  const nameParts = userProfile?.username.split('.');
  const firstName = nameParts?.length > 0 ? capitalize(nameParts[0]) : '';
  const lastName =
    nameParts?.length > 1 ? capitalize(nameParts[nameParts?.length - 1]) : '';

  return {
    getInitials(): string {
      if (nameParts?.length > 0) {
        const firstNameInitial = firstName?.length > 0 ? firstName[0] : '';
        const lastNameInitial = lastName?.length > 0 ? lastName[0] : '';
        return firstNameInitial + lastNameInitial;
      }
      return '';
    },
    getFullName(): string {
      return `${firstName} ${lastName}`;
    },
    getFirstName(): string {
      return firstName;
    },
    getOfficeLocation(): string {
      const office = userProfile?.officeLocation?.office;
      const country = userProfile?.officeLocation?.country;
      if (office && country) {
        return `${office}, ${country}`;
      }
      return '';
    },
  };
}
function capitalize(text: string): string {
  if (text?.length > 0) {
    return text[0].toUpperCase() + text.slice(1);
  }
  return text;
}
