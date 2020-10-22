import {DynamoDBStreamHandler} from 'aws-lambda/trigger/dynamodb-stream';
import {skillSearchRepository} from './adapter/elasticsearch/skill-search.elasticsearch-repository';
import {Skill, SkillId, SkillName} from './domain-model/skill';
import {Username, UserProfile} from './domain-model/user-profile';
import {userProfileSearchRepository} from './adapter/elasticsearch/user-profile-search.elasticsearch-repository';
import {createDocumentUpdatesFromDynamodbStreamRecords} from './adapter/dynamodb/dynamodb-stream-utils';

export const handleSkills: DynamoDBStreamHandler = function (event) {
  console.log(JSON.stringify(event, null, 2));
  try {
    const updates = createDocumentUpdatesFromDynamodbStreamRecords<Skill>(event.Records, attributes => {
      const skillId = attributes?.[SkillId.attributeName];
      const skillName = attributes?.[SkillName.attributeName];
      return Skill.parse(skillId, skillName);
    });
    return updates ? skillSearchRepository.onSkillUpdates(updates) : Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
};

export const handleUserProfiles: DynamoDBStreamHandler = function (event) {
  console.log(JSON.stringify(event, null, 2));
  try {
    const updates = createDocumentUpdatesFromDynamodbStreamRecords<UserProfile>(event.Records, attributes => {
      const username = attributes?.[Username.attributeName];
      return UserProfile.builder(username).attributes(attributes).build();
    });
    return updates ? userProfileSearchRepository.onUserProfileUpdates(updates) : Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
};
