/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import AWS from 'aws-sdk';
import {
  CreateTableInput,
  KeySchema,
  AttributeDefinitions,
  GlobalSecondaryIndexList,
  LocalSecondaryIndexList
} from 'aws-sdk/clients/dynamodb';
// @ts-ignore
import yaml from 'js-yaml';
// @ts-ignore
import fs from 'fs';

interface ServerlessConfig {
  inputs: {
    attributeDefinitions: AttributeDefinitions;
    keySchema: KeySchema;
    localSecondaryIndexes?: LocalSecondaryIndexList;
    globalSecondaryIndexes?: GlobalSecondaryIndexList;
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

createTableFromServerlessConfig('skill-table-loc', '../skill-table/serverless.yml')
  .then(() => createTableFromServerlessConfig('user-profile-table-loc', '../user-profile-table/serverless.yml'));

function createTableFromServerlessConfig(tableName: string, serverlessConfigFilePath: string): Promise<void> {
  return loadTableMetadataFrom(serverlessConfigFilePath)
    .then(tableMetadata => deleteTableIfExists(tableName)
      .then(() => createTable(tableName, tableMetadata))
    )
    .then(
      () => console.log(`${tableName} table successfully created`),
      error => {
        console.log(`Creating ${tableName} table failed: ${error}`);
        return Promise.reject(error);
      }
    );
}

function loadTableMetadataFrom(serverlessYamlFilePath: string): Promise<TableMetadata> {
  return new Promise<TableMetadata>((resolve, reject) => {
    try {
      const serverlessConfig = yaml.safeLoad(fs.readFileSync(serverlessYamlFilePath, 'utf8')) as ServerlessConfig;
      const attributeDefinitions: AttributeDefinitions = serverlessConfig?.inputs?.attributeDefinitions;
      const keySchema: KeySchema = serverlessConfig?.inputs?.keySchema;
      if (attributeDefinitions && keySchema) {
        const tableMetadata: TableMetadata = {AttributeDefinitions: attributeDefinitions, KeySchema: keySchema};
        const localSecondaryIndices: LocalSecondaryIndexList | undefined = serverlessConfig?.inputs?.localSecondaryIndexes;
        if (localSecondaryIndices) {
          tableMetadata.LocalSecondaryIndexes = localSecondaryIndices;
        }
        const globalSecondaryIndices: GlobalSecondaryIndexList | undefined = serverlessConfig?.inputs?.globalSecondaryIndexes;
        if (globalSecondaryIndices) {
          tableMetadata.GlobalSecondaryIndexes = globalSecondaryIndices;
        }
        resolve(tableMetadata);
      } else {
        reject(`input.attributeDefinitions or input.keySchema could not be found in ${serverlessYamlFilePath}`);
      }
    } catch (e) {
      console.error(e);
      reject(`Serverless config could not be loaded from ${serverlessYamlFilePath}`);
    }
  });
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
