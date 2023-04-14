import { Injectable } from '@nestjs/common';
import { CreateAttributeSpecItemDto } from './dto/create-attribute-spec-item.dto';
import { UpdateAttributeSpecItemDto } from './dto/update-attribute-spec-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AttributeSpecItem } from './entities/attribute-spec-item.entity';
import { Model, Types } from 'mongoose';
import { AttributeSpecItemFilterType } from 'src/utils/types/attribute-spec-item-filter.type';

@Injectable()
export class AttributeSpecItemService {
  constructor(
    @InjectModel(AttributeSpecItem.name)
    private attributeSpecItemModel: Model<AttributeSpecItem>,
  ) {}

  async create(
    createAttributeSpecItemDto: CreateAttributeSpecItemDto[],
  ): Promise<AttributeSpecItem[]> {
    return this.attributeSpecItemModel.create(createAttributeSpecItemDto);
  }

  async createOne(
    createAttributeSpecItemDto: CreateAttributeSpecItemDto,
  ): Promise<AttributeSpecItem> {
    const attr = new this.attributeSpecItemModel(createAttributeSpecItemDto);
    return attr.save();
  }

  async findByQuery(
    filter: AttributeSpecItemFilterType,
  ): Promise<AttributeSpecItem[]> {
    filter = filter ? filter : null;

    return this.attributeSpecItemModel.find(filter).exec();
  }

  async findByListProductId(
    listProductId: { productID: string }[],
  ): Promise<AttributeSpecItem[]> {
    let filter =
      listProductId.length > 0
        ? {
            $or: listProductId,
          }
        : null;

    return this.attributeSpecItemModel.find(filter).exec();
  }
}
