import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {
  HydratedDocument,
  Schema as MongooseSchema,
  Types,
} from 'mongoose';
import { AttributeSpecItem } from 'src/modules/attribute-spec-item/entities/attribute-spec-item.entity';
import { PromotionItem } from 'src/modules/promotion-item/entities/promotion-item.entity';
export type ProductDocument = HydratedDocument<Product>;

@Schema({ _id: false, versionKey: false })
class ProductVariant {
  @Prop({ type: String, unique: true })
  sku: string;

  @Prop({ type: Number })
  stockQuantity: number;

  @Prop({ type: Number })
  price: number;

  @Prop({ type: Number })
  priceMarket: number;
}

const ProductVariantSchema = SchemaFactory.createForClass(ProductVariant);

@Schema({ _id: false })
export class Product {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: AttributeSpecItem.name },
    ],
  })
  attributeSpecItems: AttributeSpecItem[];

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: PromotionItem.name,
      },
    ],
  })
  promotionItems: PromotionItem[];

  @Prop()
  name: string;

  @Prop()
  brandName: string;

  @Prop()
  nameAscii: string;

  @Prop()
  urlPicture: string;

  @Prop({ required: false })
  labelInst: string;

  @Prop({ required: false })
  labelFlashSale: string;

  @Prop({ type: ProductVariantSchema, required: false })
  productVariant: ProductVariant;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
