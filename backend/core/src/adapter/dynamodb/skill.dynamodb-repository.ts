import {DocumentClient} from 'aws-sdk/lib/dynamodb/document_client';
import AWS from 'aws-sdk';
import {SkillRepository} from '../../domain-model/skill.repository';
import {Skill, SkillName} from '../../domain-model/skill';
import {DocumentAlreadyExistsError} from '../../domain-model/common';
import {appConfig} from '../../app-config';

class SkillDynamodbRepository implements SkillRepository {
  private readonly dynamodb: DocumentClient;

  constructor() {
    this.dynamodb = new AWS.DynamoDB.DocumentClient({
      region: appConfig.awsRegion,
      endpoint: appConfig.awsDynamodbEndpoint
    });
  }

  createNew(skillName: SkillName): Promise<Skill> {
    return this.skillNotExistsYet(skillName)
      .then(() => {
        const skill = Skill.createNew(skillName);
        return this.dynamodb.put({
          TableName: appConfig.awsDynamodbSkillTable,
          Item: skill.toPlainAttributes()
        }).promise().then(() => skill);
      });
  }

  private skillNotExistsYet(skillName: SkillName): Promise<void> {
    return this.dynamodb.query({
      TableName: appConfig.awsDynamodbSkillTable,
      IndexName: appConfig.awsDynamodbSkillNameGsi,
      KeyConditionExpression: '#nameAttr = :nameAttrValue',
      ExpressionAttributeNames: {'#nameAttr': SkillName.attributeName},
      ExpressionAttributeValues: {':nameAttrValue': skillName.value}
    }).promise().then(response => {
      const skillWithSameNameAlreadyExists = !!(response?.Items && response.Items.length);
      if (skillWithSameNameAlreadyExists) {
        return Promise.reject(new DocumentAlreadyExistsError());
      }
    });
  }
}

export const skillRepository: SkillRepository = new SkillDynamodbRepository();
