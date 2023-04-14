import { Controller, Get, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { AttributeSpecItemService } from '../attribute-spec-item/attribute-spec-item.service';
import { PromotionItemService } from '../promotion-item/promotion-item.service';
import { Request } from 'express';

import { dataType } from 'src/utils/types/data.type';
import { CategoryService } from '../category/category.service';
import { SpecItemService } from '../spec-item/spec-item.service';
import { AttributeItemService } from '../attribute-item/attribute-item.service';
import { queryParser } from 'src/utils/functions';
import { Product } from './entities/product.entity';

/**
 * @example url
 * /product?
 * brand=Apple|asus|hp&
 * price=0-10e6|20e6-25e6&
 * page=2&
 * cpu=i5|i7|r5|r7&
 * gpu=amd|nvidia&
 * ram= 4 Gb|8 Gb
 * screen=13inch|14 inch
 * zero=Trả góp 0%&
 * sort=low_price  one in [low_price,hight_price,best_sell]
 */
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly attributeSpecItemService: AttributeSpecItemService,
    private readonly promotionItemService: PromotionItemService,
    private readonly attributeItemService: AttributeItemService,
    private readonly categoryService: CategoryService,
    private readonly specItemService: SpecItemService,
  ) {}

  @Get()
  /* --------------- @Header('Content-Type', 'application/json') -------------- */
  async find(@Req() req: Request) {
    let data: dataType;
    let products: Product[];
    const queryParsed = queryParser(req);

    // get data for menu and navigation
    const [categories, attributeItems, specItems] = await Promise.all([
      this.categoryService.findAll(),
      this.attributeItemService.findAll(),
      this.specItemService.findAll(),
    ]);

    if (
      !queryParsed.hasFilterByAttributeSpecItem &&
      !queryParsed.hasFilterProduct
    ) {
      // get products with product queries
      products = await this.productService.findForIndex(queryParsed);
    } else {
      products = await this.productService.find(queryParsed);
    }

    data = {
      listDefault: {
        list: products,
      },
      navFilter: {
        listCategory: categories,
      },
      navFilterAttributeItem: {
        attributeItems: attributeItems,
        specItems: specItems,
      },
    };

    return data;
  }
}
