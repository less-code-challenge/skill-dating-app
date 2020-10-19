import {DynamoDBStreamHandler} from 'aws-lambda/trigger/dynamodb-stream';
import {skillSearchRepository} from './adapter/elasticsearch/skill-search.elasticsearch-repository';
import {Skill, SkillId, SkillName} from './domain-model/skill';

export const handler: DynamoDBStreamHandler = function (event) {
  console.log(JSON.stringify(event, null, 2));

  if (event.Records.length > 0) {
    const skillDynamodbRecord = event.Records[0];
    if (skillDynamodbRecord.eventName === 'INSERT') {
      const skill = skillDynamodbRecord.dynamodb?.NewImage;
      const skillId = skill?.[SkillId.attributeName]?.S;
      const skillName = skill?.[SkillName.attributeName]?.S;
      try {
        return skillSearchRepository.onNewSkillCreation(Skill.parse(skillId, skillName));
      } catch (e) {
        return Promise.reject(new Error(`Skill ${JSON.stringify(skill)} could not be updated in ES`));
      }
    }
  }
  return Promise.resolve();
};
