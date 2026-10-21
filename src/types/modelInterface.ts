// Maps every field of an entity to its database column, so a model can't miss a field
export type ColumnMap<T> = { readonly [K in keyof T]: string };

export interface ModelDefinition<T> {
  readonly table: string;
  readonly columns: ColumnMap<T>;
}

// Firestore collection nested under a parent document, e.g. chats/{chatId}/messages
export interface SubcollectionModel<T> {
  readonly parentCollection: string;
  readonly collection: string;
  readonly fields: ColumnMap<T>;
}
