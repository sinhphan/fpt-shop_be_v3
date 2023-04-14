import { StringFilterType } from './string-filter.type';

export interface AttributeSpecItemFilterType {
  $and?: {
    'attributeSpecItems.specName': StringFilterType;
  }[];
}
