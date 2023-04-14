import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import { Model, ObjectId, Types } from 'mongoose';
import { QueryParseType } from 'src/utils/types/query-parse.type';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = new this.productModel(createProductDto);
    return newProduct.save();
  }

  /**
   *
   * @param query
   * @returns Promise<Product[]>
   */
  async find(query: QueryParseType): Promise<Product[]> {
    const skip: number = query.pagination.limit * (query.pagination.page - 1);
    const filter = query.productFilters ? query.productFilters : {};
    const attributeFilters = query.attributeSpecItemFilters
      ? query.attributeSpecItemFilters
      : {};

    // setup filter for query
    return this.productModel
      .aggregate([
        {
          $match: filter,
        },
        {
          $lookup: {
            from: 'attributespecitems',
            localField: 'attributeSpecItems',
            foreignField: '_id',
            pipeline: [
              {
                $sort: {
                  'attributeSpecItems.attributeID': -1,
                },
              },
            ],
            as: 'attributeSpecItems',
          },
        },
        {
          $lookup: {
            from: 'promotionitems',
            localField: 'promotionItems',
            foreignField: '_id',
            pipeline: [
              {
                $sort: {
                  'promotionItems.displayOrder': -1,
                },
              },
            ],
            as: 'promotionItems',
          },
        },
        {
          $match: attributeFilters,
        },
        {
          $sort: query.productSort,
        },
      ])
      .limit(query.pagination.limit)
      .skip(skip)
      .exec();
  }

  async findForIndex(query: QueryParseType): Promise<Product[]> {
    const skip: number = query.pagination.limit * (query.pagination.page - 1);
    const filter = query.productFilters ? query.productFilters : null;
    return this.productModel
      .find(filter)
      .sort(query.productSort)
      .limit(query.pagination.limit)
      .skip(skip)
      .populate('attributeSpecItems')
      .populate('promotionItems')
      .exec();
  }

  async findOne(id: string): Promise<Product> {
    return this.productModel
      .findById(new Types.ObjectId(id))
      .populate('attributeSpecItems')
      .populate('promotionItems')
      .exec();
  }

  updateMany(ids: ObjectId, updateProductDto: UpdateProductDto[]) {
    return this.productModel.updateMany(
      { $or: [{ _id: ids }] },
      updateProductDto,
    );
  }
}
