export enum SearchField {
  BY_ASSET_ID = 'by_asset_id',
  BY_TITLE = 'by_title'
};

export interface SearchVector {
  field: SearchField;
  value: any;
}

export interface SortVector {
  field: string;
  desc: boolean;
}
