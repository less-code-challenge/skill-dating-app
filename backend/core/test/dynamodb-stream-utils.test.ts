import {DynamoDBRecord} from 'aws-lambda/trigger/dynamodb-stream';
import {
  createDocumentUpdatesFromDynamodbStreamRecords,
  createSkillPopularityUpdate
} from '../src/adapter/dynamodb/dynamodb-stream-utils';
import {UserProfile, userProfileFactory} from '../src/domain-model/user-profile';

describe('dynamodb-stream-utils', () => {
  it('flats Dynamodb stream attribute values of a user profile', () => {
    // given
    const dynamodbStreamRecords = [
      createUserProfileModifyRecord('john.example', ['Angular'], ['Angular', 'Java'])
    ];
    // when
    const updates = createDocumentUpdatesFromDynamodbStreamRecords<UserProfile>(dynamodbStreamRecords, userProfileFactory);
    // then
    expect(updates).toBeDefined();
    expect(updates?.documentsToDelete).toBeDefined();
    expect(updates?.documentsToDelete?.length).toBe(0);
    expect(updates?.documentsToCreateOrUpdate).toBeDefined();
    expect(updates?.documentsToCreateOrUpdate?.length).toBe(1);
    const profile = updates?.documentsToCreateOrUpdate?.[0];
    expect(profile?.username.value).toBe('john.example');
  });

  it('creates a skill popularity update', () => {
    // given
    const dynamodbStreamRecords = [
      createUserProfileModifyRecord('john.example', ['Angular', 'React'], ['Angular', 'Java'])
    ];
    // when
    const update = createSkillPopularityUpdate(dynamodbStreamRecords, userProfileFactory);
    // then
    expect(update).toBeDefined();
    expect(Object.keys(update || {}).length).toBe(2);
    expect(update?.Java).toBe(1);
    expect(update?.React).toBe(-1);
  });
});

function createUserProfileModifyRecord(username: string, oldSkills?: string[], newSkills?: string[]): DynamoDBRecord {
  const oldSkillsAsJson = skillsAsJson(oldSkills);
  const newSkillsAsJson = skillsAsJson(newSkills);

  const recordsAsJson = `{
    "eventID": "a49f1fc783303b8a4ba3d47993cbfeed",
    "eventName": "MODIFY",
    "eventVersion": "1.1",
    "eventSource": "aws:dynamodb",
    "awsRegion": "eu-central-1",
    "dynamodb": {
      "ApproximateCreationDateTime": 1603354253,
      "Keys": {
        "username": {
          "S": "${username}"
        }
      },
      "NewImage": {
        ${newSkillsAsJson}
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
          "S": "${username}"
        }
      },
      "OldImage": {
        ${oldSkillsAsJson}
        "username": {
          "S": "${username}"
        }
      },
      "SequenceNumber": "4709000000000006483060825",
      "SizeBytes": 162,
      "StreamViewType": "NEW_AND_OLD_IMAGES"
    },
    "eventSourceARN": "arn:aws:dynamodb:eu-central-1:931105827624:table/user-profile-dev/stream/2020-10-21T07:47:12.378"
  }`;

  return JSON.parse(recordsAsJson) as DynamoDBRecord;

  function skillsAsJson(skills: string[] | undefined): string {
    return skills?.map(skill => `{"S": "${skill}"}`)
      .reduce((json, skillAsJson, currentIndex, array) => {
        const first = currentIndex === 0;
        if (first) {
          json += '"skills": {"L": [';
        }
        json += skillAsJson;
        const last = currentIndex === array.length - 1;
        json += last ? ']},' : ', ';
        return json;
      }, '') || '';

  }
}
