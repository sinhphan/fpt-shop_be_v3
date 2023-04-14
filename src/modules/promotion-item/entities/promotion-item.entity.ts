import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Product } from 'src/modules/product/entities/product.entity';

export type PromotionItemDocument = PromotionItem & mongoose.Document;

@Schema()
export class PromotionItem {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop({ type: String, require: true })
  sku: string;

  @Prop({ type: String, require: true })
  promotionName: string;

  @Prop({ type: String, require: true })
  urlPicture: string;

  @Prop({ type: Number, require: true })
  displayOrder: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  productID: Product;
}

export const PromotionItemSchema = SchemaFactory.createForClass(PromotionItem);
