export type ColumnMap<T> = { readonly [K in keyof T]: string };

export interface ModelDefinition<T> {
  readonly table: string;
  readonly columns: ColumnMap<T>;
}

export interface SubcollectionModel<T> {
  readonly parentCollection: string;
  readonly collection: string;
  readonly fields: ColumnMap<T>;
}
