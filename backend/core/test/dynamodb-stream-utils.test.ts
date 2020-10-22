import {DynamoDBRecord} from 'aws-lambda/trigger/dynamodb-stream';
import {createDocumentUpdatesFromDynamodbStreamRecords} from '../src/adapter/dynamodb/dynamodb-stream-utils';
import {Username, UserProfile} from '../src/domain-model/user-profile';

describe('dynamodb-stream-utils', () => {

  it('flats Dynamodb stream attribute values of a user profile', () => {
    const recordsAsJson = `[{
    "eventID": "a49f1fc783303b8a4ba3d47993cbfeed",
    "eventName": "MODIFY",
    "eventVersion": "1.1",
    "eventSource": "aws:dynamodb",
    "awsRegion": "eu-central-1",
    "dynamodb": {
      "ApproximateCreationDateTime": 1603354253,
      "Keys": {
        "username": {
          "S": "marek.matczak79"
        }
      },
      "NewImage": {
        "skills": {
          "L": [
            {
              "S": "Angular"
            }
          ]
        },
        "officeLocation": {
          "M": {
            "country": {
              "S": "Poland"
            },
            "office": {
              "S": "Wrocław"
            },
            "region": {
              "S": "Europe"
            }
          }
        },
        "username": {
          "S": "marek.matczak79"
        }
      },
      "OldImage": {
        "skills": {
          "L": [
            {
              "S": "Angular"
            }
          ]
        },
        "username": {
          "S": "marek.matczak79"
        }
      },
      "SequenceNumber": "4709000000000006483060825",
      "SizeBytes": 162,
      "StreamViewType": "NEW_AND_OLD_IMAGES"
    },
    "eventSourceARN": "arn:aws:dynamodb:eu-central-1:931105827624:table/user-profile-dev/stream/2020-10-21T07:47:12.378"
  }]`;

    const dynamodbStreamRecords = JSON.parse(recordsAsJson) as DynamoDBRecord[];

    // when
    const updates = createDocumentUpdatesFromDynamodbStreamRecords<UserProfile>(dynamodbStreamRecords,
      attributes => {
        const username = attributes?.[Username.attributeName];
        return UserProfile.builder(username).attributes(attributes).build();
      });

    // then
    expect(updates).toBeDefined();
    expect(updates?.documentsToDelete).toBeDefined();
    expect(updates?.documentsToDelete?.length).toBe(0);
    expect(updates?.documentsToCreateOrUpdate).toBeDefined();
    expect(updates?.documentsToCreateOrUpdate?.length).toBe(1);
    const profile = updates?.documentsToCreateOrUpdate?.[0];
    expect(profile?.username.value).toBe('marek.matczak79');
  });
});
