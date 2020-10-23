import {OfficeLocationTo} from './office-location.to';

export interface UserProfileTo {
  username: string;
  description?: string;
  phoneNo?: string;
  officeLocation?: OfficeLocationTo;
  skills?: string[];
}
