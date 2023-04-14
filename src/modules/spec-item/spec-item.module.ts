import { Module } from '@nestjs/common';
import { SpecItemService } from './spec-item.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecItem, SpecItemSchema } from './entities/spec-item.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SpecItem.name,
        schema: SpecItemSchema,
      },
    ]),
  ],
  providers: [SpecItemService],
  exports: [SpecItemService],
})
export class SpecItemModule {}
