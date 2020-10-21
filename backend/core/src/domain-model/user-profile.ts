import {assert} from './validation';
import {AttributeMap} from './common';
import {OfficeLocation} from './office-location';
import {SkillName, skillsAttributeName} from './skill';

export class Username {
  static readonly attributeName = 'username';
  static readonly emailRegExp = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  static parse(value: string): Username {
    assert('user profile username').of(value)
      .isNotEmpty();
    assert('user profile username').of(`${value.trim()}@example.com`)
      .matches(Username.emailRegExp);

    return new Username(value);
  }

  private constructor(public readonly value: string) {
  }
}

export class UserProfileDescription {
  static readonly attributeName = 'description';
  static readonly maxLength = 255;

  static parse(value: string): UserProfileDescription {
    assert('User Profile Description').of(value)
      .isNotEmpty()
      .isNotLongerThan(UserProfileDescription.maxLength);

    return new UserProfileDescription(value.trim());
  }

  private constructor(public readonly value: string) {
  }
}

export class PhoneNo {
  static readonly attributeName = 'phoneNo';
  static readonly regExp = /^\+[0-9]{1,3}[0-9 \-()]{6,20}$/;

  static parse(value: string): PhoneNo {
    assert('user profile phone number').of(value)
      .isNotEmpty();
    assert('user profile username').of(`${value.trim()}@example.com`)
      .matches(PhoneNo.regExp);

    return new PhoneNo(value);
  }

  private constructor(public readonly value: string) {
  }
}

export interface UserProfileBuilder {
  attributes(attributes: AttributeMap | undefined): UserProfileBuilder;

  build(): UserProfile;
}

export class UserProfile {
  static builder(usernameValue: string): UserProfileBuilder {
    let description: UserProfileDescription;
    let phoneNo: PhoneNo;
    let officeLocation: OfficeLocation;
    let skills: SkillName[];
    const username = Username.parse(usernameValue);

    return {
      attributes(attributes: AttributeMap | undefined): UserProfileBuilder {
        if (attributes) {
          const descriptionAttrValue = attributes[UserProfileDescription.attributeName];
          if (descriptionAttrValue) {
            description = UserProfileDescription.parse(descriptionAttrValue);
          }
          const phoneNoAttrValue = attributes[PhoneNo.attributeName];
          if (phoneNoAttrValue) {
            phoneNo = UserProfileDescription.parse(phoneNoAttrValue);
          }
          const officeLocationAttrValue = attributes[OfficeLocation.attributeName];
          if (officeLocationAttrValue) {
            officeLocation = OfficeLocation.parse(officeLocationAttrValue);
          }
          const skillsAttrValue = attributes[skillsAttributeName];
          if (skillsAttrValue && Array.isArray(skillsAttrValue) && skillsAttrValue.length > 0) {
            skills = skillsAttrValue.map(skillName => SkillName.parse(skillName));
          }
        }
        return this;
      },
      build(): UserProfile {
        return new UserProfile(username, description, phoneNo, officeLocation, skills);
      }
    };
  }

  private constructor(public readonly username: Username,
                      public readonly description?: UserProfileDescription,
                      public readonly phoneNo?: PhoneNo,
                      public readonly officeLocation?: OfficeLocation,
                      public readonly skills?: SkillName[]
  ) {
  }

  toPlainAttributes(): AttributeMap {
    const userProfileAttributes: AttributeMap = {username: this.username.value};
    if (this.description) {
      userProfileAttributes[UserProfileDescription.attributeName] = this.description.value;
    }
    if (this.phoneNo) {
      userProfileAttributes[PhoneNo.attributeName] = this.phoneNo.value;
    }
    if (this.officeLocation) {
      userProfileAttributes[OfficeLocation.attributeName] = this.officeLocation.toPlainAttributes();
    }
    if (this.skills) {
      userProfileAttributes[skillsAttributeName] = this.skills.map(skillName => skillName.value);
    }
    return userProfileAttributes;
  }
}


