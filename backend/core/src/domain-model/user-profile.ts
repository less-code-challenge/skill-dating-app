import {assert} from './validation';
import {AttributeMap} from './common';
import {OfficeLocation} from './office-location';
import {Skill, SkillId, SkillName, skillsAttributeName} from './skill';

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
  attributes(attributes: AttributeMap): UserProfileBuilder;

  skill(skillAttributes: AttributeMap): UserProfileBuilder;

  build(): UserProfile;
}

export class UserProfile {
  static builder(usernameValue: string): UserProfileBuilder {
    let description: UserProfileDescription;
    let phoneNo: PhoneNo;
    let officeLocation: OfficeLocation;
    const skills: Skill[] = [];
    const username = Username.parse(usernameValue);

    return {
      attributes(attributes: AttributeMap): UserProfileBuilder {
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
            OfficeLocation.parse(officeLocationAttrValue);
          }
        }
        return this;
      },
      skill(skillAttributes: AttributeMap): UserProfileBuilder {
        if (skillAttributes) {
          const idAttrValue = skillAttributes[SkillId.attributeName];
          const nameAttrValue = skillAttributes[SkillName.attributeName];
          skills.push(Skill.parse(idAttrValue, nameAttrValue));
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
                      public readonly skills?: Skill[]
  ) {
  }

  toPlainAttributesSkippingSkills(): AttributeMap {
    return this.toPlainAttributesInternal(false);
  }

  toPlainAttributes(): AttributeMap {
    return this.toPlainAttributesInternal(true);
  }

  private toPlainAttributesInternal(includeSkills: boolean = false): AttributeMap {
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
    if (includeSkills && this.skills) {
      userProfileAttributes[skillsAttributeName] = this.skills.map(skill => skill.toPlainAttributes());
    }
    return userProfileAttributes;
  }
}


