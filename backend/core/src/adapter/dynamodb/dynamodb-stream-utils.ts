import {AttributeValue, DynamoDBRecord} from 'aws-lambda/trigger/dynamodb-stream';
import {AttributeMap, DocumentUpdates, HavingPrimaryKey, SerializableAsAttributeMap} from '../../domain-model/common';

type DynamodbStreamImage = { [key: string]: AttributeValue };

type DocumentFactoryFn<T extends HavingPrimaryKey & SerializableAsAttributeMap> = (attributes: AttributeMap | undefined) => T;

export function createDocumentUpdatesFromDynamodbStreamRecords<T extends HavingPrimaryKey & SerializableAsAttributeMap>(
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
      const dynamodbStreamAttributeValue = attributeMap[attributeName];
      attribute[attributeName] = mapDynamodbStreamValueToSimpleOne(dynamodbStreamAttributeValue);
      return attribute;
    }).reduce((attributeMap, singleAttribute) => {
      return Object.assign(attributeMap, singleAttribute);
    }, {});
  }

  function flatDynamodbStreamAttributeValuesInArray(attributeValues: AttributeValue[] | undefined): any[] | undefined {
    return attributeValues?.map(mapDynamodbStreamValueToSimpleOne);
  }

  function mapDynamodbStreamValueToSimpleOne(dynamodbStreamAttributeValue: AttributeValue): any {
    let attributeValue;
    if (dynamodbStreamAttributeValue.S) {
      attributeValue = dynamodbStreamAttributeValue.S;
    } else if (dynamodbStreamAttributeValue.BOOL) {
      attributeValue = dynamodbStreamAttributeValue.BOOL;
    } else if (dynamodbStreamAttributeValue.NULL) {
      attributeValue = null;
    } else if (dynamodbStreamAttributeValue.N) {
      attributeValue = parseFloat(dynamodbStreamAttributeValue.N);
    } else if (dynamodbStreamAttributeValue.NS) {
      attributeValue = dynamodbStreamAttributeValue.NS.map(numberAttrValue => parseFloat(numberAttrValue));
    } else if (dynamodbStreamAttributeValue.SS) {
      attributeValue = dynamodbStreamAttributeValue.SS;
    } else if (dynamodbStreamAttributeValue.M) {
      attributeValue = flatDynamodbStreamAttributeValues(dynamodbStreamAttributeValue.M);
    } else if (dynamodbStreamAttributeValue.L) {
      attributeValue = flatDynamodbStreamAttributeValuesInArray(dynamodbStreamAttributeValue.L);
    }
    return attributeValue;
  }
}
