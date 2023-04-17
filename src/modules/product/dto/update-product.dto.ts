import { PartialType } from '@nestjs/mapped-types';
import {
  CreateProductDto,
  CreateProductVariantDto,
} from './create-product.dto';
import { AttributeSpecItem } from 'src/modules/attribute-spec-item/entities/attribute-spec-item.entity';
import { ObjectId, Types } from 'mongoose';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  attributeSpecItems?: Types.ObjectId[];
  promotionItems?: Types.ObjectId[];
}
