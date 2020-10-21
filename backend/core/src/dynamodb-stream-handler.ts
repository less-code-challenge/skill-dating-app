import {AttributeValue, DynamoDBRecord, DynamoDBStreamHandler} from 'aws-lambda/trigger/dynamodb-stream';
import {skillSearchRepository} from './adapter/elasticsearch/skill-search.elasticsearch-repository';
import {Skill, SkillId, SkillName} from './domain-model/skill';
import {Username, UserProfile} from './domain-model/user-profile';
import {AttributeMap, DocumentUpdates, HavingPrimaryKey, SerializableAsAttributeMap} from './domain-model/common';
import {userProfileSearchRepository} from './adapter/elasticsearch/user-profile-search.elasticsearch-repository';

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

type DynamodbStreamImage = { [key: string]: AttributeValue };

type DocumentFactoryFn<T extends HavingPrimaryKey & SerializableAsAttributeMap> = (attributes: AttributeMap | undefined) => T;

function createDocumentUpdatesFromDynamodbStreamRecords<T extends HavingPrimaryKey & SerializableAsAttributeMap>(
  dynamodbStreamRecords: DynamoDBRecord[] | undefined,
  documentFactoryFn: DocumentFactoryFn<T>): DocumentUpdates<T> | undefined {
  if (dynamodbStreamRecords) {
    return dynamodbStreamRecords.reduce((updates, dynamodbStreamRecord) => {
      if (dynamodbStreamRecord.eventName === 'REMOVE') {
        const documentAttributes = flatDynamodbStreamAttributeValues(dynamodbStreamRecord.dynamodb?.OldImage);
        const document = documentFactoryFn(documentAttributes);
        updates.documentsToDelete.push(document);
      } else { // INSERT, MODIFY
        const documentAttributes = flatDynamodbStreamAttributeValues(dynamodbStreamRecord.dynamodb?.NewImage);
        const document = documentFactoryFn(documentAttributes);
        updates.documentsToCreateOrUpdate.push(document);
      }
      return updates;
    }, {documentsToCreateOrUpdate: [], documentsToDelete: []} as DocumentUpdates<T>);
  }
}

function flatDynamodbStreamAttributeValues(attributeMap: DynamodbStreamImage | undefined): AttributeMap | undefined {
  if (attributeMap) {
    return Object.keys(attributeMap).map(attributeName => {
      const attribute: AttributeMap = {};
      let attributeValue = null;
      const dynamodbStreamAttributeValue = attributeMap[attributeName];

      if (dynamodbStreamAttributeValue.S) {
        attributeValue = dynamodbStreamAttributeValue.S;
      } else if (dynamodbStreamAttributeValue.SS) {
        attributeValue = dynamodbStreamAttributeValue.SS;
      }
      attribute[attributeName] = attributeValue;
      return attribute;
    }).reduce((attributeMap, singleAttribute) => {
      return Object.assign(attributeMap, singleAttribute);
    }, {});
  }
}
