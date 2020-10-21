import {DynamoDBStreamHandler} from 'aws-lambda/trigger/dynamodb-stream';
import {skillSearchRepository} from './adapter/elasticsearch/skill-search.elasticsearch-repository';
import {Skill, SkillId, SkillName} from './domain-model/skill';
import {SkillUpdates} from './domain-model/skill-search.repository';

export const handler: DynamoDBStreamHandler = function (event) {
  console.log(JSON.stringify(event, null, 2));

  if (event.Records.length > 0) {
    try {
      const skillUpdates = event.Records.reduce<SkillUpdates>((acc, skillDynamodbRecord) => {
        let skill, skillId;
        if (skillDynamodbRecord.eventName === 'REMOVE') {
          skill = skillDynamodbRecord.dynamodb?.OldImage;
          skillId = skill?.[SkillId.attributeName]?.S;
          acc.documentsToDelete.push(SkillId.parse(skillId));
        } else { // INSERT, MODIFY
          skill = skillDynamodbRecord.dynamodb?.NewImage;
          skillId = skill?.[SkillId.attributeName]?.S;
          const skillName = skill?.[SkillName.attributeName]?.S;
          acc.documentsToCreateOrUpdate.push(Skill.parse(skillId, skillName));
        }
        return acc;
      }, {documentsToCreateOrUpdate: [], documentsToDelete: []});

      return skillSearchRepository.onSkillUpdates(skillUpdates);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  return Promise.resolve();
};
