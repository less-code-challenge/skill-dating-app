export interface UserProfileTo {
  username: string;
  description?: string;
  phoneNo?: string;
  officeLocation?: string;
  skills?: SkillTo[];
}

export interface SkillTo {
  id: string;
  name?: string;
}
