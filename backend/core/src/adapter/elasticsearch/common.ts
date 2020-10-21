import {Client} from '@elastic/elasticsearch';
import {DocumentUpdates} from '../../domain-model/common';
import {appConfig} from '../../app-config';

export function createClient(): Client {
  return new Client({
    node: appConfig.elasticsearchUrl,
    auth: {
      username: appConfig.elasticsearchUsername,
      password: appConfig.elasticsearchPassword
    }
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function bulk(documentUpdates: DocumentUpdates<any>, index: string): Promise<void> {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bulkOperations: Record<string, any>[] = [];
  const documentsToDelete = documentUpdates?.documentsToDelete;
  if (documentsToDelete) {
    documentsToDelete.forEach(document => {
      bulkOperations.push({delete: {_index: index, _id: document.getPrimaryKeyAsString()}});
    });
  }

  const documentsToCreateOrUpdate = documentUpdates?.documentsToCreateOrUpdate;
  if (documentsToCreateOrUpdate) {
    documentsToCreateOrUpdate.forEach(document => {
      bulkOperations.push({index: {_index: index, _id: document.getPrimaryKeyAsString()}});
      bulkOperations.push(document.toPlainAttributes());
    });
  }

  if (bulkOperations.length > 0) {
    return createClient().bulk({refresh: true, body: bulkOperations})
      .then(({body}) => {
        if (body.errors) {
          console.warn('Some documents have not been processed correctly', body.items);
        }
      });
  }
  return Promise.resolve();
}
