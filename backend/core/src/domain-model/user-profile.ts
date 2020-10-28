import {assert} from './validation';
import {AttributeMap, HavingPrimaryKey, SerializableAsAttributeMap} from './common';
import {OfficeLocation} from './office-location';
import {SkillName, skillsAttributeName} from './skill';

export class Username {
  static readonly attributeName = 'username';
  static readonly emailRegExp = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  static parse(value: string | undefined): Username {
    assert('user profile username').of(value)
      .isNotEmpty();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore value at this point is not empty
    assert('user profile username').of(`${value.trim()}@example.com`)
      .matches(Username.emailRegExp);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore value at this point is not empty and is a valid email
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

export class UserProfile implements HavingPrimaryKey, SerializableAsAttributeMap {
  static builder(usernameValue: string | undefined): UserProfileBuilder {
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

  getPrimaryKeyAsString(): string {
    return this.username.value;
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

export function userProfileFactory(attributes: AttributeMap | undefined): UserProfile {
  const username = attributes?.[Username.attributeName];
  return UserProfile.builder(username).attributes(attributes).build();
}

