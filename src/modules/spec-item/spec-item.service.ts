import { Injectable } from '@nestjs/common';
import { CreateSpecItemDto } from './dto/create-spec-item.dto';
import { UpdateSpecItemDto } from './dto/update-spec-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SpecItem } from './entities/spec-item.entity';
import { Model } from 'mongoose';

@Injectable()
export class SpecItemService {
  constructor(
    @InjectModel(SpecItem.name) private specItemModel: Model<SpecItem>,
  ) {}

  async create(createSpecItemDto: CreateSpecItemDto): Promise<SpecItem> {
    const specItem = new this.specItemModel(createSpecItemDto);
    return specItem.save();
  }

  async findAll(): Promise<SpecItem[]> {
    return this.specItemModel.find().exec();
  }
}
