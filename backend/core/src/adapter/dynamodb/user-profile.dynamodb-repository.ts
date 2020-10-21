import {UserProfileRepository} from '../../domain-model/user-profile.repository';
import {Username, UserProfile} from '../../domain-model/user-profile';
import {DocumentClient} from 'aws-sdk/lib/dynamodb/document_client';
import AWS from 'aws-sdk';
import {appConfig} from '../../app-config';

class UserProfileDynamodbRepository implements UserProfileRepository {
  private readonly dynamodb: DocumentClient;

  constructor() {
    this.dynamodb = new AWS.DynamoDB.DocumentClient({
      region: appConfig.awsRegion,
      endpoint: appConfig.awsDynamodbEndpoint
    });
  }

  createNewOrUpdate(userProfile: UserProfile): Promise<UserProfile> {
    return this.dynamodb.put({
      TableName: appConfig.awsDynamodbUserProfileTable,
      Item: userProfile.toPlainAttributes()
    }).promise().then(() => userProfile);
  }

  findByUsername(username: Username): Promise<UserProfile | null> {
    const usernameValue = username.value;
    return this.dynamodb.get({
      TableName: appConfig.awsDynamodbUserProfileTable,
      Key: {username: usernameValue}
    }).promise().then(
      ({Item: userProfileAttributes}) => {
        return userProfileAttributes ? UserProfile.builder(usernameValue)
          .attributes(userProfileAttributes)
          .build() : null;
      }
    );
  }
}

export const userProfileRepository: UserProfileRepository = new UserProfileDynamodbRepository();
