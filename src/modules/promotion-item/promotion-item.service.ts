import { Injectable } from '@nestjs/common';
import { CreatePromotionItemDto } from './dto/create-promotion-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PromotionItem } from './entities/promotion-item.entity';
import { Model } from 'mongoose';

@Injectable()
export class PromotionItemService {
  constructor(
    @InjectModel(PromotionItem.name)
    private promotionModel: Model<PromotionItem>,
  ) {}

  async create(
    createPromotionItemDto: CreatePromotionItemDto[],
  ): Promise<PromotionItem[]> {
    return this.promotionModel.create(createPromotionItemDto);
  }

  findAll() {
    return `This action returns all promotionItem`;
  }

  async findByProductSku(listSku: { sku: string }[]): Promise<PromotionItem[]> {
    const filter =
      listSku.length > 0
        ? {
            $or: listSku,
          }
        : null;

    return this.promotionModel
      .find(filter)
      .sort({ sku: 1, displayOrder: 1 })
      .exec();
  }
}
