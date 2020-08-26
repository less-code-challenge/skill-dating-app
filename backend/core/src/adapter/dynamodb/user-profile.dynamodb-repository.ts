import {UserProfileRepository} from '../../domain-model/user-profile.repository';
import {Username, UserProfile, UserProfileBuilder} from '../../domain-model/user-profile';
import {DocumentClient} from 'aws-sdk/lib/dynamodb/document_client';
import AWS, {AWSError} from 'aws-sdk';
import {DocumentAlreadyExistsError, DocumentNotExistsError} from '../../domain-model/common';
import {appConfig} from '../../app-config';
import {SkillUpdate} from '../../domain-model/skill';
import Put = DocumentClient.Put;
import TransactWriteItem = DocumentClient.TransactWriteItem;
import AttributeMap = DocumentClient.AttributeMap;
import QueryOutput = DocumentClient.QueryOutput;

class UserProfileDynamodbRepository implements UserProfileRepository {
  private readonly dynamodb: DocumentClient;

  constructor() {
    this.dynamodb = new AWS.DynamoDB.DocumentClient({
      region: appConfig.awsRegion,
      endpoint: appConfig.awsDynamodbEndpoint
    });
  }

  findByUsername(username: Username): Promise<UserProfile | null> {
    const userProfileKey = createUserProfileKeyFrom(username.value);
    return this.dynamodb.query({
      TableName: appConfig.awsDynamodbUserProfileTable,
      KeyConditionExpression: 'PK = :userKey',
      ExpressionAttributeValues: {':userKey': `${userProfileKey}`}
    }).promise()
      .then(buildUserProfileFromQueryOutput);

    function buildUserProfileFromQueryOutput(queryOutput: QueryOutput): UserProfile | null {
      const userAndSkills = queryOutput?.Items;
      if (userAndSkills && userAndSkills.length) {
        const userProfileBuilder = userAndSkills.reduce<UserProfileBuilder>(
          collectUserProfileDataToBuild,
          UserProfile.builder(username.value)
        );
        return userProfileBuilder.build();
      }
      return null;
    }

    function collectUserProfileDataToBuild(userProfileBuilder: UserProfileBuilder, userOrSkill: AttributeMap) {
      const sortKey = userOrSkill['SK'];
      const isUser = sortKey === userProfileKey;
      if (isUser) {
        userProfileBuilder.attributes(userOrSkill);
      } else { // sortKey is a skill key
        userProfileBuilder.skill({
          id: parseSkillIdFromKey(sortKey),
          name: userOrSkill['name']
        });
      }

      return userProfileBuilder;
    }
  }

  createNew(userProfile: UserProfile): Promise<UserProfile> {
    const userProfilePutInput = putInputBuilderOf(userProfile)
      .allowOnlyIfUserProfileNotExistsYet()
      .build();
    return this.dynamodb.put(userProfilePutInput)
      .promise().then(
        () => userProfile,
        catchAwsConditionalCheckFailureAndReplaceItWith(new DocumentAlreadyExistsError())
      );
  }

  update(newUserProfile: UserProfile, skillUpdate: SkillUpdate): Promise<UserProfile> {
    const userProfileKey = createUserProfileKeyFrom(newUserProfile.username.value);
    const userProfilePutInput = putInputBuilderOf(newUserProfile)
      .allowOnlyIfUserProfileAlreadyExists()
      .build();

    if (skillUpdate.isEmpty()) {
      return this.dynamodb.put(userProfilePutInput).promise()
        .then(
          () => newUserProfile,
          catchAwsConditionalCheckFailureAndReplaceItWith(new DocumentNotExistsError())
        );
    } else {
      const skillPutItems = createPutInputsOf(skillUpdate);
      const skillDeleteItems = createDeleteInputsOf(skillUpdate);
      return this.dynamodb.transactWrite({
        TransactItems: [{Put: userProfilePutInput}, ...skillPutItems, ...skillDeleteItems]
      }).promise()
        .then(
          () => newUserProfile,
          catchAwsConditionalCheckFailureAndReplaceItWith(new DocumentNotExistsError())
        );
    }

    function createPutInputsOf(skillsToUpdate: SkillUpdate) {
      return skillsToUpdate.mapSkillsToPut<TransactWriteItem>(skill => {
        const skillKey = createSkillKeyFrom(skill.id.value);
        return {
          Put: {
            TableName: appConfig.awsDynamodbUserProfileTable,
            Item: {PK: userProfileKey, SK: skillKey, name: skill.name.value}
          }
        };
      });
    }

    function createDeleteInputsOf(skillsToUpdate: SkillUpdate) {
      return skillsToUpdate.mapIdsOfSkillsToDelete<TransactWriteItem>(skillId => {
        const skillKey = createSkillKeyFrom(skillId.value);
        return {
          Delete: {
            TableName: appConfig.awsDynamodbUserProfileTable,
            Key: {PK: userProfileKey, SK: skillKey}
          }
        };
      });
    }
  }
}

export const userProfileRepository: UserProfileRepository = new UserProfileDynamodbRepository();

function putInputBuilderOf(userProfile: UserProfile) {
  let partitionKeyNotExists = false;
  let partitionKeyExists = false;

  return {
    allowOnlyIfUserProfileNotExistsYet() {
      partitionKeyNotExists = true;
      return this;
    },

    allowOnlyIfUserProfileAlreadyExists() {
      partitionKeyExists = true;
      return this;
    },

    build(): Put {
      const userProfilePk = createUserProfileKeyFrom(userProfile.username.value);
      const userProfileAttributes = userProfile.toPlainAttributesSkippingSkills();
      const putInput: Put = {
        TableName: appConfig.awsDynamodbUserProfileTable,
        Item: {PK: userProfilePk, SK: userProfilePk, ...userProfileAttributes}
      };
      if (partitionKeyNotExists) {
        putInput.ConditionExpression = 'attribute_not_exists(PK)';
      }
      if (partitionKeyExists) {
        putInput.ConditionExpression = 'attribute_exists(PK)';
      }
      return putInput;
    }
  };
}

function catchAwsConditionalCheckFailureAndReplaceItWith(error: Error) {
  return function (awsError: AWSError): Promise<never> {
    return Promise.reject(awsError.name === 'ConditionalCheckFailedException' ? error : awsError);
  };
}

function createUserProfileKeyFrom(username: string) {
  return `u#${username}`;
}

function createSkillKeyFrom(id: string) {
  return `s#${id}`;
}

function parseSkillIdFromKey(key: string): string {
  let skillId;
  if (key && key.startsWith('s#')) {
    skillId = key.substr(2);
  }
  if (skillId) {
    return skillId;
  } else {
    throw new Error('skill ID could not be parsed from SK');
  }
}
