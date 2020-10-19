import {DynamoDBStreamHandler} from 'aws-lambda/trigger/dynamodb-stream';

export const handler: DynamoDBStreamHandler = function (event,
                                                        context,
                                                        callback) {
  console.log(JSON.stringify(event, null, 2));
  event.Records.forEach(function (record) {
    console.log(record.eventID);
    console.log(record.eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);
  });
  callback();
};
