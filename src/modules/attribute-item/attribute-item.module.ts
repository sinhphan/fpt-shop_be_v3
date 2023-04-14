import { Module } from '@nestjs/common';
import { AttributeItemService } from './attribute-item.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AttributeItem,
  AttributeItemSchema,
} from './entities/attribute-item.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AttributeItem.name, schema: AttributeItemSchema },
    ]),
  ],
  providers: [AttributeItemService],
  exports: [AttributeItemService],
})
export class AttributeItemModule {}
