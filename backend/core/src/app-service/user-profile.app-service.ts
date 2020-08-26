import {UserProfile} from '../domain-model/user-profile';
import {AttributeMap, DocumentNotExistsError} from '../domain-model/common';
import {userProfileRepository} from '../adapter/dynamodb/user-profile.dynamodb-repository';
import {skillRepository} from '../adapter/dynamodb/skill.dynamodb-repository';
import {createSkillIdsFromAttributes, SkillId, SkillUpdate} from '../domain-model/skill';

class UserProfileAppService {
  loadUserProfile(username: string): Promise<UserProfile | null> {
    try {
      const userProfile = UserProfile.builder(username).build();
      return userProfileRepository.findByUsername(userProfile.username);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  createNewUserProfile(username: string): Promise<UserProfile> {
    try {
      const userProfile = UserProfile.builder(username).build();
      return userProfileRepository.createNew(userProfile);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  updateUserProfile(username: string, userProfileAttributes: AttributeMap): Promise<UserProfile> {
    try {
      const newUserProfile = UserProfile.builder(username)
        .attributes(userProfileAttributes)
        .build();
      const newSkillIds = createSkillIdsFromAttributes(userProfileAttributes);
      return userProfileRepository.findByUsername(newUserProfile.username)
        .then(checkIfUserProfileExists)
        .then(updateOldUserProfileWith(newUserProfile, newSkillIds));
    } catch (e) {
      return Promise.reject(e);
    }

    function checkIfUserProfileExists(oldUserProfile: UserProfile | null): Promise<UserProfile> {
      return oldUserProfile ? Promise.resolve(oldUserProfile) : Promise.reject(new DocumentNotExistsError());
    }

    function updateOldUserProfileWith(newUserProfile: UserProfile, newSkillIds: SkillId[]) {
      return function (oldUserProfile: UserProfile): Promise<UserProfile> {
        const skillUpdate = SkillUpdate.builder()
          .idsOfOldSkills(oldUserProfile.skills?.map(skill => skill.id))
          .idsOfNewSkills(newSkillIds).build();

        return enrichSkillsToPutBySkillNamesIfNecessary(skillUpdate)
          .then(enrichedSkillUpdate => userProfileRepository.update(newUserProfile, enrichedSkillUpdate));
      };

      function enrichSkillsToPutBySkillNamesIfNecessary(skillUpdate: SkillUpdate): Promise<SkillUpdate> {
        if (skillUpdate.hasSkillsToPut()) {
          return skillRepository.findByIds(skillUpdate.idsOfSkillsToPut)
            .then(skillMap => {
              skillUpdate.enrichSkillsToPutBySkillNames(skillMap);
              return skillUpdate;
            });
        } else {
          return Promise.resolve(skillUpdate);
        }
      }
    }
  }
}

export = new UserProfileAppService();
