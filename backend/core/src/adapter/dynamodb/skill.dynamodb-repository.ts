import {DocumentClient} from 'aws-sdk/lib/dynamodb/document_client';
import AWS from 'aws-sdk';
import {SkillRepository} from '../../domain-model/skill.repository';
import {Skill, SkillId, SkillMap, SkillName} from '../../domain-model/skill';
import {DocumentAlreadyExistsError} from '../../domain-model/common';
import {appConfig} from '../../app-config';
import BatchGetRequestMap = DocumentClient.BatchGetRequestMap;
import AttributeMap = DocumentClient.AttributeMap;
import BatchGetItemOutput = DocumentClient.BatchGetItemOutput;
import ItemList = DocumentClient.ItemList;
import ScanOutput = DocumentClient.ScanOutput;

class SkillDynamodbRepository implements SkillRepository {
  private readonly dynamodb: DocumentClient;

  constructor() {
    this.dynamodb = new AWS.DynamoDB.DocumentClient({
      region: appConfig.awsRegion,
      endpoint: appConfig.awsDynamodbEndpoint
    });
  }

  findByIds(ids: SkillId[]): Promise<SkillMap> {
    const batchGetRequest: BatchGetRequestMap = {};
    const skillTableName = appConfig.awsDynamodbSkillTable;
    batchGetRequest[skillTableName] = {Keys: ids.map(id => ({id: id.value}))};

    return this.dynamodb.batchGet({RequestItems: batchGetRequest})
      .promise()
      .then(handleUnprocessedRequests)
      .then(checkIfAllRequestedSkillsFound)
      .then(createSkillMapFromQueryOutput);

    function handleUnprocessedRequests(output: BatchGetItemOutput): BatchGetItemOutput | Promise<never> {
      const anyUnprocessedKeys = output?.UnprocessedKeys && Object.keys(output.UnprocessedKeys).length;
      return anyUnprocessedKeys ? Promise.reject(new Error('batchGet skills did not process all items')) : output;
    }

    function checkIfAllRequestedSkillsFound(output: BatchGetItemOutput): ItemList | Promise<never> {
      const skills = output?.Responses && output.Responses[skillTableName];
      const allRequestedSkillsFound = skills && skills.length === ids.length;
      return skills && allRequestedSkillsFound ? skills : Promise.reject(new Error('batchGet skills did not find all items'));
    }

    function createSkillMapFromQueryOutput(skills: ItemList): SkillMap {
      return skills.reduce<SkillMap>(addSkillsToMap, {});
    }

    function addSkillsToMap(skillMap: SkillMap, skill: AttributeMap): SkillMap {
      const skillId = skill[SkillId.attributeName];
      skillMap[skillId] = Skill.parse(skillId, skill[SkillName.attributeName]);
      return skillMap;
    }
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

  findAll(): Promise<Skill[]> {
    return this.dynamodb.scan({
      TableName: appConfig.awsDynamodbSkillTable,
      Limit: 200
    }).promise()
      .then(createSkillsFromQueryOutput);

    function createSkillsFromQueryOutput(output: ScanOutput): Skill[] {
      const skills = output?.Items || [];
      return skills.map(skill => Skill.parse(skill.id, skill.name));
    }
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
