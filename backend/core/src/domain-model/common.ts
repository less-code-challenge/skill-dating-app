// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AttributeMap = { [attribute: string]: any };

export class DocumentAlreadyExistsError extends Error {
  static NAME = 'DocumentAlreadyExistsError';

  constructor() {
    super();
    this.name = DocumentAlreadyExistsError.NAME;
  }
}

export class DocumentNotExistsError extends Error {
  static NAME = 'DocumentNotExistsError';

  constructor() {
    super();
    this.name = DocumentNotExistsError.NAME;
  }
}

export type DocumentUpdates<T, ID> = {
  documentsToCreateOrUpdate: T[];
  documentsToDelete: ID[];
}
