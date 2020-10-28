export const appConfig = {
  awsRegion: process.env.AWS_REGION || 'eu-central-1',
  awsDynamodbEndpoint: process.env.AWS_DYNAMODB_ENDPOINT || undefined,
  awsDynamodbSkillTable: process.env.skillTable || 'skill-table-loc',
  awsDynamodbSkillNameGsi: process.env.skillNameGsi || 'SKILL_NAME_GSI',
  awsDynamodbUserProfileTable: process.env.userProfileTable || 'user-profile-table-loc',
  elasticsearchUrl: process.env.elasticsearchUrl || 'https://search-user-profiles-folbu7t6tixn2vdcu5zn4vfupq.eu-central-1.es.amazonaws.com/',
  elasticsearchUsername: process.env.elasticsearchUsername || 'elastic',
  elasticsearchPassword: process.env.elasticsearchPassword || '',
  elasticsearchSkillIndex: process.env.elasticsearchSkillIndex || 'skills',
  elasticsearchUserProfileIndex: process.env.elasticsearchUserProfileIndex || 'profiles',
  elasticsearchSkillPopularityIndex: process.env.elasticsearchSkillPopularityIndex || 'skill-popularity',
};
