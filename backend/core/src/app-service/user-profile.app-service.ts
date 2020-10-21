import {Username, UserProfile} from '../domain-model/user-profile';
import {userProfileRepository} from '../adapter/dynamodb/user-profile.dynamodb-repository';
import {AttributeMap} from '../domain-model/common';

class UserProfileAppService {
  loadUserProfile(username: string): Promise<UserProfile | null> {
    return parseUsername(username)
      .then(usernameValueObject => userProfileRepository.findByUsername(usernameValueObject));
  }

  createNewUserProfileOrUpdateExistingOne(username: string, userProfileAttributes: AttributeMap | undefined): Promise<UserProfile> {
    return buildUserProfile(username, userProfileAttributes)
      .then(userProfile => userProfileRepository.createNewOrUpdate(userProfile));
  }
}

export = new UserProfileAppService();

function parseUsername(username: string): Promise<Username> {
  return new Promise<Username>(resolve => resolve(Username.parse(username)));
}

function buildUserProfile(username: string, userProfileAttributes: AttributeMap | undefined): Promise<UserProfile> {
  return new Promise<UserProfile>(resolve => resolve(
    UserProfile.builder(username)
      .attributes(userProfileAttributes)
      .build()
    )
  );
}
