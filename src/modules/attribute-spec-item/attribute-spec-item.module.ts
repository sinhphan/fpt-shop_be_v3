import { Module } from '@nestjs/common';
import { AttributeSpecItemService } from './attribute-spec-item.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AttributeSpecItem,
  AttributeSpecItemSchema,
} from './entities/attribute-spec-item.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AttributeSpecItem.name, schema: AttributeSpecItemSchema },
    ]),
  ],
  providers: [AttributeSpecItemService],
  exports: [AttributeSpecItemService],
})
export class AttributeSpecItemModule {}
