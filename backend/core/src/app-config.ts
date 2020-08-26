export const appConfig = {
  awsRegion: process.env.AWS_REGION || 'eu-central-1',
  awsDynamodbEndpoint: process.env.AWS_DYNAMODB_ENDPOINT || undefined,
  awsDynamodbSkillTable: process.env.skillTable || 'skill-table-loc',
  awsDynamodbSkillNameGsi: process.env.skillNameGsi || 'SKILL_NAME_GSI',
  awsDynamodbUserProfileTable: process.env.userProfileTable || 'user-profile-table-loc',
  awsDynamodbSkillGsi: process.env.skillGsi || 'SKILL_GSI'
};
