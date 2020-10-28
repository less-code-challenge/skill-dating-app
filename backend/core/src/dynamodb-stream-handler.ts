import {DynamoDBStreamEvent, DynamoDBStreamHandler} from 'aws-lambda/trigger/dynamodb-stream';
import {skillSearchRepository} from './adapter/elasticsearch/skill-search.elasticsearch-repository';
import {Skill, SkillId, SkillName} from './domain-model/skill';
import {UserProfile, userProfileFactory} from './domain-model/user-profile';
import {userProfileSearchRepository} from './adapter/elasticsearch/user-profile-search.elasticsearch-repository';
import {
  createDocumentUpdatesFromDynamodbStreamRecords,
  createSkillPopularityUpdate
} from './adapter/dynamodb/dynamodb-stream-utils';
import {skillPopularityRepository} from './adapter/elasticsearch/skill-popularity.elasticsearch-repository';

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
    return Promise.all([
      updateUserProfiles(event),
      updateSkillPopularity(event)
    ]).then(() => undefined);
  } catch (e) {
    return Promise.reject(e);
  }
};

function updateUserProfiles(event: DynamoDBStreamEvent): Promise<void> {
  const updates = createDocumentUpdatesFromDynamodbStreamRecords<UserProfile>(event.Records, userProfileFactory);
  return updates ? userProfileSearchRepository.onUserProfileUpdates(updates) : Promise.resolve();
}

function updateSkillPopularity(event: DynamoDBStreamEvent): Promise<void> {
  const newSkillPopularity = createSkillPopularityUpdate(event.Records, userProfileFactory);
  return newSkillPopularity ? skillPopularityRepository.merge(newSkillPopularity) : Promise.resolve();
}
