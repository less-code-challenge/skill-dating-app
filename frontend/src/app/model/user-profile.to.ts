import { OfficeLocationTo } from './office-location.to';
import { SkillTo } from './skill.to';

export interface UserProfileTo {
  username: string;
  description?: string;
  phoneNo?: string;
  officeLocation?: OfficeLocationTo;
  skills?: SkillTo[];
}
