/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import AWS from 'aws-sdk';
import {
  AttributeDefinitions,
  CreateTableInput,
  GlobalSecondaryIndexList,
  KeySchema,
  LocalSecondaryIndexList
} from 'aws-sdk/clients/dynamodb';
// @ts-ignore
import yaml from 'js-yaml';
// @ts-ignore
import fs from 'fs';
import {DocumentClient} from 'aws-sdk/lib/dynamodb/document_client';
import LocalSecondaryIndex = DocumentClient.LocalSecondaryIndex;
import GlobalSecondaryIndex = DocumentClient.GlobalSecondaryIndex;

type CustomValues = { [key: string]: string };

interface ServerlessConfig {
  custom: CustomValues;
  resources: {
    Resources: { [resourceName: string]: { Type: string, Properties: TableMetadata } }
  }
}

interface TableMetadata {
  AttributeDefinitions: AttributeDefinitions;
  KeySchema: KeySchema;
  LocalSecondaryIndexes?: LocalSecondaryIndexList;
  GlobalSecondaryIndexes?: GlobalSecondaryIndexList;
}

const dynamodbService = new AWS.DynamoDB({
  region: 'eu-central-1',
  endpoint: 'http://localhost:8000/'
});

createTableFromServerlessConfig(
  'skill-table-loc', 'serverless.yml', 'SkillDynamoDBTable')
  .then(() => createTableFromServerlessConfig(
    'user-profile-table-loc', 'serverless.yml', 'UserProfileDynamoDBTable'));

function createTableFromServerlessConfig(newTableName: string, serverlessConfigFilePath: string, resourceName: string): Promise<void> {
  return loadTableMetadataFrom(serverlessConfigFilePath, resourceName)
    .then(tableMetadata => deleteTableIfExists(newTableName)
      .then(() => createTable(newTableName, tableMetadata))
    )
    .then(
      () => console.log(`${newTableName} table successfully created`),
      error => {
        console.log(`Creating ${newTableName} table failed: ${error}`);
        return Promise.reject(error);
      }
    );
}

function deleteTableIfExists(tableName: string): Promise<void> {
  return dynamodbService.deleteTable({TableName: tableName}).promise()
    .then(
      () => undefined,
      err => {
        if (err.name !== 'ResourceNotFoundException') {
          console.error(err);
          return Promise.reject(`Deleting table ${tableName} failed`);
        }
      });
}

function createTable(tableName: string, tableMetadata: TableMetadata): Promise<void> {
  const createTableInput: CreateTableInput = {
    ...tableMetadata,
    TableName: tableName,
    BillingMode: 'PAY_PER_REQUEST'
  };
  return dynamodbService.createTable(createTableInput).promise().then(() => undefined);
}

function loadTableMetadataFrom(serverlessYamlFilePath: string, resourceName: string): Promise<TableMetadata> {
  return new Promise<TableMetadata>((resolve, reject) => {
    try {
      const serverlessConfig = yaml.safeLoad(fs.readFileSync(serverlessYamlFilePath, 'utf8')) as ServerlessConfig;

      const resource = serverlessConfig.resources.Resources[resourceName];
      if (resource.Type !== 'AWS::DynamoDB::Table') {
        reject(`The requested resource ${resourceName} is not a Dynamodb Table`);
      } else {
        const tableMetadata = resource.Properties;
        tableMetadata.GlobalSecondaryIndexes =
          replaceIndexNames<GlobalSecondaryIndex>(tableMetadata.GlobalSecondaryIndexes).with(serverlessConfig.custom);
        tableMetadata.LocalSecondaryIndexes =
          replaceIndexNames<LocalSecondaryIndex>(tableMetadata.LocalSecondaryIndexes).with(serverlessConfig.custom);
        resolve(tableMetadata);
      }
    } catch (e) {
      reject(`Serverless config could not be loaded from ${serverlessYamlFilePath}`);
    }
  });

  function replaceIndexNames<T extends LocalSecondaryIndex | GlobalSecondaryIndex>(indexes: T[] | undefined) {
    return {
      with(customValues: CustomValues) {
        if (indexes) {
          return indexes.map(index => {
            if (index?.IndexName) {
              const replacedValue = replace(index.IndexName).withOneOf(customValues);
              if (replacedValue) {
                return {...index, IndexName: replacedValue};
              }
            }
            return index;
          });
        }
        return indexes;
      }
    };

    function replace(expression: string) {
      return {
        withOneOf(customValues: CustomValues): string | undefined {
          const keysOfCustomValues = Object.keys(customValues);
          for (let i = 0; i < keysOfCustomValues.length; i++) {
            const key = keysOfCustomValues[i];
            const newEvaluatedValue = expression.replace('${self:custom.' + key + '}', customValues[key]);
            if (newEvaluatedValue !== expression) {
              return newEvaluatedValue;
            }
          }
        }
      };
    }
  }
}
